import logger from "@/shared/utils/logger";
import { sendSlackNotification } from "@/shared/utils/monitor";
import promiseLimiter from "@/shared/utils/promiseLimiter";
import { DBPerformanceWrite } from "@classic-hub/shared/types/database";
import { callDatabaseFunction } from "@/infrastructure/supabase/database";
import {
  saveFailuresToArtifact,
  FAILED_RECORDS_FILENAME,
} from "@/infrastructure/github/saveFailuresToArtifact";
import { extractPerformances } from "../1_extract";
import { transformPerformances } from "../2_transform";
import { retry } from "@/application/services/retry";

// 대상 기간에 따라 Extract → Transform → Load 전체 과정을 수행하는 오케스트레이터
export const syncPerformanceData = async (
  startDate: string,
  endDate: string,
  afterDate: string,
  updateEndDate: string,
  maxRepeat: number,
) => {
  // 1. Extract 단계 (공연 원본 데이터 페칭 — 이미지 버퍼는 transform에서 1건씩 페칭)
  const { performances, idsToDelete } = await extractPerformances(
    startDate,
    endDate,
    afterDate,
    updateEndDate,
  );

  // 2. Transform 단계 (공연 1건 = 이미지 페칭 + 가공 묶음을 동시 5건씩 병렬 처리)
  const results = await promiseLimiter(
    performances,
    (performance) => transformPerformances(performance),
    5,
  );

  // 첫 시도에서 성공한 공연 데이터 분리
  const transformSuccesses: DBPerformanceWrite[] = results
    .map((result) => result.data)
    .filter((data): data is DBPerformanceWrite => data !== null);

  // 첫 시도에서 실패한 공연의 원본 입력 + 결과 추출 & 로깅
  const failedInputs = performances
    .map((performance, index) => ({
      input: performance,
      result: results[index],
    }))
    .filter((pair) => pair.result.error !== null);

  if (failedInputs.length > 0) {
    logger.info(`[PROCESS_FAIL] First pass failures: ${failedInputs.length}`);
  }

  // 3. 재시도 (실패한 공연의 원본 입력을 들고 동일한 처리 묶음을 재호출)
  // processor/sleep/log은 컴포지션 시점에 주입한다 (extract flows의 deps 패턴과 동일)
  const { retrySuccesses, retryFailures } = await retry(failedInputs, maxRepeat, {
    processor: transformPerformances,
    sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
    log: logger,
  });
  transformSuccesses.push(
    ...retrySuccesses
      .map((result) => result.data)
      .filter((data): data is DBPerformanceWrite => data !== null),
  );

  // 4. 재시도 이후에도 실패한 데이터가 존재한다면 알림 전송 & Artifact에 저장
  if (retryFailures.length > 0) {
    await sendSlackNotification(
      `❌ [PROCESS_FAIL] ${retryFailures.length} Item Process Failed`,
    );
    saveFailuresToArtifact(
      FAILED_RECORDS_FILENAME,
      retryFailures,
      "ProcessError",
    );
  }

  // 5. DB에 bulk insert
  try {
    await callDatabaseFunction("upsert_performances_bulk", {
      payload: transformSuccesses,
    });
  } catch (error) {
    logger.error("[INSERT_FAIL] DB Batch Insert failed", error);
    await sendSlackNotification("❌ [INSERT_FAIL] Data Bulk Insert Failed");
    // DB insert에 실패한 데이터도 알림 전송 & Artifact 저장
    saveFailuresToArtifact(
      FAILED_RECORDS_FILENAME,
      transformSuccesses,
      "BatchInsertError",
    );
  }
};
