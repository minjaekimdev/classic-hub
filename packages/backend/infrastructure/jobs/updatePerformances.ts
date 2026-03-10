import dayjs from "dayjs";
import { APIError, withErrorHandling } from "shared/utils/error";
import { getColumnData, getRowsByCondition } from "@/infrastructure/database";
import logger from "shared/utils/logger";
import { sendSlackNotification } from "shared/utils/monitor";
import { getPerformanceIds } from "../../application/use-cases/kopis/getPerformanceIds";
import deletePerformances from "../../application/use-cases/database/deletePerformances";
import fetchAndInsertPerformances from "@/application/use-cases/database/fetchAndInsertPerformances";
import RateLimiter from "shared/utils/rateLimiter";
import processPerformance from "../../application/orchestrator/processPerformance";
import { ProcessResult } from "shared/types/sync";

const MAX_REPEAT = 5;
const kopisRateLimiter = new RateLimiter(300);

const retry = async (initialFailures: Array<string>) => {
  let currentFailures = initialFailures;
  let repeat = 1;

  // 실패 데이터가 있고, 최대 시도 횟수를 넘지 않는 동안 반복
  while (currentFailures.length > 0 && repeat <= MAX_REPEAT) {
    logger.info(
      `🔄 Starting retry #${repeat}... (Remaining: ${currentFailures.length})`,
    );

    // 지수적 백오프 대기
    const minute = 2 ** repeat;
    await new Promise((r) => setTimeout(r, 60000 * minute));

    // 동시 실행 횟수 제한 필요
    const results = await Promise.all(
      initialFailures.map(async (id) => {
        return await processPerformance(id);
      }),
    );

    // 만약 에러 없이 싹 성공했다면 (undefined 반환 시) 빈 배열로 치환해서 종료
    const nowFailures = results.filter((result) => result.error);
    logger.info(`Failed Performances (Retry #${repeat}): ${nowFailures}`);
    currentFailures = nowFailures.map((item) => item.id) ?? [];
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

  logger.info(
    `Fetching new performance datas (period: ${startDate} ~ ${endDate})`,
  );
  const newPerformances = await getPerformanceIds(
    startDate,
    endDate,
    kopisRateLimiter,
  );

  const dbPerformances = await getColumnData("performances", "performance_id");

  const newPerformancesSet = new Set(newPerformances);
  const dbPerformancesSet = new Set(dbPerformances);

  // DB에는 있지만 새 공연 데이터에는 없는 id -> 삭제 대상
  const idsToDelete = [...dbPerformances].filter(
    (id) => !newPerformancesSet.has(id),
  );
  // 새 공연 데이터에는 있지만 DB에는 없는 id -> 삽입 대상
  const idsToInsert = [...newPerformances].filter(
    (id) => !dbPerformancesSet.has(id),
  );

  // 공연 데이터 삭제
  console.log(`IDs to Delete: ${idsToDelete}`);
  logger.info("Deleting old performance datas...");

  // 내부에서 fallback 로직 실행
  await deletePerformances(idsToDelete);

  logger.info("Processing New & Updated Performance datas...");

  // update 관련 로직은 상대적으로 중요도가 낮으므로 새 공연 데이터 삽입이 완료된 이후에 실행
  const idsToUpdate = await getPerformanceIds(
    startDate,
    updateEndDate,
    kopisRateLimiter,
    afterDate,
  );

  const targetIds = [...idsToInsert, ...idsToUpdate];

  // 한번에 실행하는 갯수 제한 필요
  const results = await Promise.all(
    targetIds.map(async (id) => {
      return await processPerformance(id);
    }),
  );

  const initialFailures = results.filter((result) => result.error);
  logger.info(`Failed Performances: ${initialFailures}`);

  await retry(initialFailures.map((item) => item.id));
})();
