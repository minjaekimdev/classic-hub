import promiseLimiter from "@/shared/utils/promiseLimiter";
import { DBPerformanceWrite } from "@classic-hub/shared/types/database";
import { DetailFetchFailure, ProcessResult, WorkflowError } from "shared/types/sync";
import { PerformanceDetail } from "@/shared/types/kopis";
import { RetryDeps, RetryFailure } from "@/application/services/retry";
import {
  buildSyncSummaryMessage,
  getRunArtifactUrl,
  SyncRunSummary,
} from "./runSummary";

const TRANSFORM_CONCURRENCY = 5;

// 오케스트레이터가 의존하는 사이드 이펙트를 모두 주입받는다 (extract flows의 deps 패턴과 동일).
// 탑레벨 import가 없으므로 테스트에서 vi.mock 없이 결정적(deterministic)으로 검증할 수 있다.
export interface SyncPerformancesDeps {
  extractPerformances: (
    startDate: string,
    endDate: string,
    afterDate: string,
    updateEndDate: string,
  ) => Promise<{
    performances: PerformanceDetail[];
    idsToDelete: string[];
    detailFetchFailures: DetailFetchFailure[];
  }>;
  transformPerformances: (
    performance: PerformanceDetail,
  ) => Promise<ProcessResult>;
  retry: <T>(
    initialFailures: RetryFailure<T>[],
    maxRepeat: number,
    deps: RetryDeps<T>,
  ) => Promise<{
    retrySuccesses: ProcessResult[];
    retryFailures: ProcessResult[];
  }>;
  insertPerformancesBulk: (payload: DBPerformanceWrite[]) => Promise<void>;
  notify: (message: string) => Promise<unknown>;
  saveFailuresToArtifact: (
    failFilePath: string,
    data: unknown[],
    errorType: WorkflowError,
  ) => void;
  failedRecordsFilename: string;
  log: {
    info: (msg: string) => void;
    error: (msg: string, error?: unknown) => void;
  };
}

// 오케스트레이터. 실행 결과를 SyncRunSummary로 반환한다.
// - 로그/Slack은 실행당 요약 1건만 (전체 내역은 artifact로)
// - 치명적 실패(최종 실패 존재, insert 실패) 판정은 반환값을 받은 호출자가 한다.
export const createSyncPerformanceData = ({
  extractPerformances,
  transformPerformances,
  retry: runRetry,
  insertPerformancesBulk,
  notify,
  saveFailuresToArtifact,
  failedRecordsFilename,
  log,
}: SyncPerformancesDeps) => {
  return async (
    startDate: string,
    endDate: string,
    afterDate: string,
    updateEndDate: string,
    maxRepeat: number,
  ) => {
    // 1. Extract 단계 (공연 원본 데이터 페칭 — 이미지 버퍼는 transform에서 1건씩 페칭)
    const { performances, detailFetchFailures } = await extractPerformances(
      startDate,
      endDate,
      afterDate,
      updateEndDate,
    );

    // 2. Transform 단계 (공연 1건 = 이미지 페칭 + 가공 묶음을 동시 5건씩 병렬 처리)
    log.info(`[PROCESS] Transform 단계 시작 (대상: ${performances.length}건)`);
    const results = await promiseLimiter(
      performances,
      (performance) => transformPerformances(performance),
      TRANSFORM_CONCURRENCY,
    );

    // 첫 시도에서 성공한 공연 데이터 분리
    const transformSuccesses: DBPerformanceWrite[] = results
      .map((result) => result.data)
      .filter((data): data is DBPerformanceWrite => data !== null);
    const firstPassSuccesses = transformSuccesses.length;

    // 첫 시도에서 실패한 공연의 원본 입력 + 결과 추출
    const failedInputs: RetryFailure<PerformanceDetail>[] = performances
      .map((performance, index) => ({
        input: performance,
        result: results[index],
      }))
      .filter((pair) => pair.result.error !== null);

    log.info(
      `[PROCESS] Transform 1차 패스 완료 (성공: ${transformSuccesses.length}, 실패: ${failedInputs.length})`,
    );

    // 3. 재시도 (실패한 공연의 원본 입력을 들고 동일한 처리 묶음을 재호출)
    const { retrySuccesses, retryFailures } = await runRetry(
      failedInputs,
      maxRepeat,
      {
        processor: transformPerformances,
        sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
        log,
      },
    );

    transformSuccesses.push(
      ...retrySuccesses
        .map((result) => result.data)
        .filter((data): data is DBPerformanceWrite => data !== null),
    );

    log.info(
      `[PROCESS] 재시도 완료 (회복: ${retrySuccesses.length}, 최종 실패: ${retryFailures.length})`,
    );

    // 4. 재시도 이후에도 실패한 데이터가 존재한다면 Artifact에 저장
    // (전체 내역은 artifact로, 로그/알림은 요약만)
    if (retryFailures.length > 0) {
      saveFailuresToArtifact(
        failedRecordsFilename,
        retryFailures,
        "ProcessError",
      );
      log.error(
        `[PROCESS_FAIL] 재시도 후에도 실패한 공연 ${retryFailures.length}건 → artifact 기록 완료`,
      );
    }

    // 4.5 extract의 상세 페칭 실패 — 인라인 재시도·2차 패스로도 회복되지 않은 유실분을 기록한다.
    if (detailFetchFailures.length > 0) {
      saveFailuresToArtifact(
        failedRecordsFilename,
        detailFetchFailures,
        "DetailFetchError",
      );
      log.error(
        `[EXTRACT_FAIL] 상세 페칭 최종 실패 ${detailFetchFailures.length}건 → artifact 기록 완료`,
      );
    }

    // 5. DB에 bulk insert (성공 데이터가 있을 때만)
    let insertSucceeded = false;
    const insertAttempted = transformSuccesses.length > 0;
    if (insertAttempted) {
      try {
        await insertPerformancesBulk(transformSuccesses);
        insertSucceeded = true;
        log.info(
          `[DB_SUCCESS] DB Bulk Insert 성공 (${transformSuccesses.length}건)`,
        );
      } catch (error) {
        log.error("[INSERT_FAIL] DB Batch Insert failed", error);
        saveFailuresToArtifact(
          failedRecordsFilename,
          transformSuccesses,
          "BatchInsertError",
        );
        log.error(
          `[INSERT_FAIL] Insert 실패 공연 ${transformSuccesses.length}건 → artifact 저장 완료`,
        );
      }
    }

    // 6. 실행 단위 요약 알림 — 성공 시에도 조용히 1건 (크론 스킵 감지)
    const summary: SyncRunSummary = {
      totalTargets: performances.length,
      firstPassSuccesses,
      retryRecovered: retrySuccesses.length,
      finalFailures: retryFailures,
      detailFetchFailures: detailFetchFailures.length,
      insertAttempted,
      insertSucceeded,
    };
    await notify(buildSyncSummaryMessage(summary, getRunArtifactUrl()));

    return summary;
  };
};
