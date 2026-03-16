import { deletePerformances } from "@/application/use-cases/database/deletePerformances";
import { getPerformanceIds } from "@/application/use-cases/kopis/getPerformanceIds";
import { ProcessResult } from "@/shared/types/sync";
import logger from "@/shared/utils/logger";
import { sendSlackNotification } from "@/shared/utils/monitor";
import promiseLimiter from "@/shared/utils/promiseLimiter";
import RateLimiter from "@/shared/utils/rateLimiter";
import { Dayjs } from "dayjs";
import { insertData } from "../database";
import { compareNewOld } from "../database/compareNewOld";
import { saveFailuresToArtifact } from "./saveFailuresToArtifact";
import { processPerformance } from "@/application/orchestrator/processPerformance";

const retry = async (
  initialFailures: Array<ProcessResult>,
  maxRepeat: number,
) => {
  const retrySuccesses = [];
  let retryFailures = initialFailures;
  let repeat = 1;

  // 실패 데이터가 있고, 최대 시도 횟수를 넘지 않는 동안 반복
  while (retryFailures.length > 0 && repeat <= maxRepeat) {
    logger.info(
      `🔄 Starting retry #${repeat}... (Remaining: ${retryFailures.length})`,
    );

    // 지수적 백오프 대기
    const minute = 2 ** repeat;
    await new Promise((r) => setTimeout(r, 60000 * minute));

    // 동시 실행 5회 제한
    const results = await promiseLimiter(
      retryFailures.map((failure) => failure.id),
      processPerformance,
      5,
      1000,
    );

    retrySuccesses.push(
      ...results.filter((result) => result.data).map((item) => item.data),
    );

    // 만약 에러 없이 모두 성공했다면 (undefined 반환 시) 빈 배열로 치환해서 종료
    // 실패한 데이터 기록 시 날짜도 같이 저장해야 할듯?
    const nowFailures = results.filter((result) => result.error);
    console.log(`Failed Performances (Retry #${repeat}):`, nowFailures);
    retryFailures = nowFailures;
    repeat++;
  }

  return { retrySuccesses, retryFailures }; // 최종적으로 성공, 실패한 목록 반환
};

export const syncPerformanceData = async (
  now: Dayjs,
  startDate: string,
  endDate: string,
  afterDate: string,
  updateEndDate: string,
  kopisRateLimiter: RateLimiter,
  table: string,
  maxRepeat: number,
) => {
  logger.info(
    `Fetching new performance datas at ${now.format("YYYYMMDD")} (target period: ${startDate} ~ ${endDate})`,
  );
  const newPerformances = await getPerformanceIds(
    startDate,
    endDate,
    kopisRateLimiter,
  );

  const { idsToDelete, idsToInsert } = await compareNewOld(newPerformances);

  // 공연 데이터 삭제
  console.log(`IDs to Delete: ${idsToDelete}`);
  logger.info("Deleting old performance datas...");

  // 내부에서 fallback 로직 실행
  await deletePerformances(idsToDelete);

  logger.info("Processing New & Updated Performance datas...");

  // 수정된 공연 데이터 가져오기
  const idsToUpdate = await getPerformanceIds(
    startDate,
    updateEndDate,
    kopisRateLimiter,
    afterDate,
  );

  // isToUpdate와 isToInsert에 동일한 key를 가진 데이터가 존재할 수 있으므로 set으로 제외
  const targetIds = [...new Set([...idsToInsert, ...idsToUpdate])];

  // DB에 배치 삽입할 데이터들을 저장하는 배열
  const successes = [];

  // 공연 데이터 처리
  const results = await promiseLimiter(targetIds, processPerformance, 5, 1000);

  // 첫 시도에서 성공한 공연 데이터들을 successes 배열에 저장
  successes.push(
    ...results.filter((result) => result.data).map((item) => item.data),
  );

  // 첫 시도에서 실패한 데이터 추출 & 로깅
  const initialFailures = results.filter((result) => result.error);
  logger.info(`Failed Performances: ${initialFailures}`);

  // 재시도
  const { retrySuccesses, retryFailures } = await retry(
    initialFailures,
    maxRepeat,
  );
  successes.push(...retrySuccesses);

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
    await insertData(table, successes, "performance_id");
  } catch (error) {
    logger.error("[INSERT_FAIL] DB Batch Insert failed", error);
    await sendSlackNotification("❌ [INSERT_FAIL] Data Bulk Insert Failed");
    // DB insert에 실패한 데이터도 알림 전송 & Artifact에 저장
    saveFailuresToArtifact(
      "failed_actions.json",
      successes,
      "BatchInsertError",
    );
  }
};
