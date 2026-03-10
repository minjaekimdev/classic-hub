import dayjs from "dayjs";
import { APIError, withErrorHandling } from "utils/error";
import { getColumnData, getRowsByCondition } from "@/infrastructure/database";
import logger from "utils/logger";
import { sendSlackNotification } from "utils/monitor";
import { getPerformanceIds } from "../../application/use-cases/kopis/getPerformanceIds";
import deletePerformances from "../../application/use-cases/database/deletePerformances";
import fetchAndInsertPerformances from "@/application/use-cases/database/fetchAndInsertPerformances";
import RateLimiter from "utils/rateLimiter";

const MAX_REPEAT = 5;
const CHUNK = 10;
const kopisRateLimiter = new RateLimiter(300);

const retry = async (initialFailures: Array<object>) => {
  let currentFailures = initialFailures;
  let repeat = 1;

  // 실패 데이터가 있고, 최대 시도 횟수를 넘지 않는 동안 반복
  while (currentFailures.length > 0 && repeat <= MAX_REPEAT) {
    logger.info(
      `🔄 재시도 ${repeat}회차 시작... (남은 개수: ${currentFailures.length})`,
    );

    // 지수적 백오프 대기
    const minute = 2 ** repeat;
    await new Promise((r) => setTimeout(r, 60000 * minute));

    // 실제 작업 수행
    const nowFailures = await fetchAndInsertPerformances(
      currentFailures.map((f) => f.id),
      kopisRateLimiter,
      `retry-${repeat}`,
    );

    // 만약 에러 없이 싹 성공했다면 (undefined 반환 시) 빈 배열로 치환해서 종료
    currentFailures = nowFailures ?? [];
    repeat++;
  }

  return currentFailures; // 최종적으로 남은 실패 목록 반환
};

(async () => {
  const now = dayjs();
  const startDate = now.format("YYYYMMDD");
  const endDate = now.add(365, "days").format("YYYYMMDD");
  const afterDate = now.subtract(1, "days").format("YYYYMMDD");
  const updateEndDate = now.add(364, "days").format("YYYYMMDD");

  // logger.info(
  //   `Fetching new performance datas (period: ${startDate} ~ ${endDate})`,
  // );
  // const newPerformances = await getPerformanceIds(
  //   startDate,
  //   endDate,
  //   kopisRateLimiter,
  // );

  // const dbPerformances = await getColumnData("performances", "performance_id");

  // const newPerformancesSet = new Set(newPerformances);
  // const dbPerformancesSet = new Set(dbPerformances);

  // // DB에는 있지만 새 공연 데이터에는 없는 id -> 삭제 대상
  // const idsToDelete = [...dbPerformances].filter(
  //   (id) => !newPerformancesSet.has(id),
  // );
  // // 새 공연 데이터에는 있지만 DB에는 없는 id -> 삽입 대상
  // const idsToInsert = [...newPerformances].filter(
  //   (id) => !dbPerformancesSet.has(id),
  // );

  // // 공연 데이터 삭제
  // console.log(`IDs to Delete: ${idsToDelete}`);
  // logger.info("Deleting old performance datas...");
  // await deletePerformances(idsToDelete);

  const rows = await getRowsByCondition("performances", "program", null);
  const idsToInsert = rows.map((row) => row.performance_id);
  logger.info(`idsToInsert: ${idsToInsert}`);

  logger.info("Processing New & Updated Performance datas...");

  // update 관련 로직은 상대적으로 중요도가 낮으므로 새 공연 데이터 삽입이 완료된 이후에 실행
  const idsToUpdate = await getPerformanceIds(
    startDate,
    updateEndDate,
    kopisRateLimiter,
    afterDate,
  );

  const targetIds = [...idsToInsert, ...idsToUpdate];

  const failures = await fetchAndInsertPerformances(
    [...idsToInsert, ...idsToUpdate],
    kopisRateLimiter,
  );

  const dbFailures = failures.filter((item) => !item.id);
  const failedCount = failures.length;
  const dbFailedCount = dbFailures.length;

  if (failedCount !== 0) {
    logger.info(
      `Final Failed Datas: ${failedCount + dbFailedCount - 1} (Including ${dbFailedCount}) DB insert failed)`,
    );
    const failuresAfterRetry = await retry(failures);
    if (failuresAfterRetry.length > 0) {
      logger.error(
        `[PROCESS_FAIL] ${
          failuresAfterRetry.length
        } performance process failed. Failure: ${failuresAfterRetry}`,
      );
      await sendSlackNotification(
        `❌ [PROCESS_FAIL] ${failuresAfterRetry.length} items failed`,
      );
    }
  }
})();
