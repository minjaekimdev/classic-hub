import logger from "@/shared/utils/logger";
import { sendSlackNotification } from "@/shared/utils/monitor";
import promiseLimiter from "@/shared/utils/promiseLimiter";
import { Dayjs } from "dayjs";
import { callDatabaseFunction } from "../../../infrastructure/external-api/supabase/database";
import { saveFailuresToArtifact } from "../../../infrastructure/external-api/github/saveFailuresToArtifact";
import { processPerformance } from "../2_transform/transformPerformances";
import { retry } from "./retry";
import { extractPerformances } from "../1_extract/extractPerformances";

// TODO: 테스트를 어디에 적용해야 할지 잘 모르겠다..
export const syncPerformanceData = async (
  now: Dayjs,
  startDate: string,
  endDate: string,
  afterDate: string,
  updateEndDate: string,
  maxRepeat: number,
) => {
  // 1. Extract 단계(공연 데이터 페칭)
  const extractedPerformances = extractPerformances(
    now,
    startDate,
    endDate,
    afterDate,
    updateEndDate,
  );

  // 2. Transform 단계(공연 데이터 가공)
  const transformedPerformances = transformPerformances(extractPerformances);

  // 첫 시도에서 성공한 공연 데이터들을 transformSuccesses 배열에 저장
  transformSuccesses.push(
    ...results.filter((result) => result.data).map((item) => item.data),
  );

  // 첫 시도에서 실패한 데이터 추출 & 로깅
  const initialFailures = results.filter((result) => result.error);
  if (initialFailures.length > 0) {
    console.log("Failed Performances: ", initialFailures);
  }

  // 재시도
  const { retrytransformSuccesses, retryFailures } = await retry(
    initialFailures,
    maxRepeat,
  );
  transformSuccesses.push(...retrytransformSuccesses);

  // 재시도 이후에도 처리에 실패한 데이터가 존재한다면 알림 전송 & Artifact에 저장
  if (retryFailures.length > 0) {
    await sendSlackNotification(
      `❌ [PROCESS_FAIL] ${retryFailures.length} Item Process Failed`,
    );
    saveFailuresToArtifact(
      "failed_actions.json",
      retryFailures,
      "ProcessError",
    );
  }

  // DB에 bulk insert
  try {
    await callDatabaseFunction("upsert_performances_bulk", {
      payload: transformSuccesses,
    });
  } catch (error) {
    logger.error("[INSERT_FAIL] DB Batch Insert failed", error);
    await sendSlackNotification("❌ [INSERT_FAIL] Data Bulk Insert Failed");
    // DB insert에 실패한 데이터도 알림 전송 & Artifact에 저장
    saveFailuresToArtifact(
      "failed_actions.json",
      transformSuccesses,
      "BatchInsertError",
    );
  }
};
