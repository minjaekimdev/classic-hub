import promiseLimiter from "@/shared/utils/promiseLimiter";
import { DBPerformanceWrite } from "@classic-hub/shared/types/database";
import { ProcessResult, WorkflowError } from "shared/types/sync";
import { PerformanceDetail } from "@/shared/types/kopis";
import { RetryDeps, RetryFailure } from "@/application/services/retry";

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

// 대상 기간에 따라 Extract → Transform → Load 전체 과정을 수행하는 오케스트레이터.
// 로그는 개수 요약만 남기고, 실패 데이터의 전체 내역은 artifact로 넘긴다.
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
    const { performances } = await extractPerformances(
      startDate,
      endDate,
      afterDate,
      updateEndDate,
    );

    // 2. Transform 단계 (공연 1건 = 이미지 페칭 + 가공 묶음을 동시 5건씩 병렬 처리)
    const results = await promiseLimiter(
      performances,
      (performance) => transformPerformances(performance),
      TRANSFORM_CONCURRENCY,
    );

    // 첫 시도에서 성공한 공연 데이터 분리
    const transformSuccesses: DBPerformanceWrite[] = results
      .map((result) => result.data)
      .filter((data): data is DBPerformanceWrite => data !== null);

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

    // 4. 재시도 이후에도 실패한 데이터가 존재한다면 Artifact에 저장 후 알림 전송
    // (전체 내역은 artifact로, 로그/알림은 요약만. Slack 실패로 데이터가 유실되지 않게 artifact를 먼저 저장)
    if (retryFailures.length > 0) {
      saveFailuresToArtifact(
        failedRecordsFilename,
        retryFailures,
        "ProcessError",
      );
      await notify(
        `❌ [PROCESS_FAIL] ${retryFailures.length} Item Process Failed`,
      );
      log.error(
        `[PROCESS_FAIL] 재시도 후에도 실패한 공연 ${retryFailures.length}건 → artifact 저장 완료`,
      );
    }

    // 5. DB에 bulk insert (성공 데이터가 있을 때만)
    if (transformSuccesses.length > 0) {
      try {
        await insertPerformancesBulk(transformSuccesses);
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
        await notify("❌ [INSERT_FAIL] Data Bulk Insert Failed");
        log.error(
          `[INSERT_FAIL] Insert 실패 공연 ${transformSuccesses.length}건 → artifact 저장 완료`,
        );
      }
    }
  };
};
