import dayjs from "dayjs";
import { APIError, withErrorHandling } from "utils/error";
import { getColumnData } from "@/infrastructure/database";
import logger from "utils/logger";
import { sendSlackNotification } from "utils/monitor";
import { getPerformanceIds } from "../../application/use-cases/kopis/getPerformanceIds";
import deletePerformances from "../../application/use-cases/database/deletePerformances";
import fetchAndInsertPerformances from "@/application/use-cases/database/fetchAndInsertPerformances";
import RateLimiter from "utils/rateLimiter";

(async () => {
  const now = dayjs();
  const startDate = now.format("YYYYMMDD");
  const endDate = now.add(365, "days").format("YYYYMMDD");
  const afterDate = now.subtract(1, "days").format("YYYYMMDD");
  const updateEndDate = now.add(364, "days").format("YYYYMMDD");

  const kopisRateLimiter = new RateLimiter(300);

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

  console.log(`IDs to Delete: ${idsToDelete}`);
  console.log(`IDs to Insert: ${idsToInsert}`);

  await deletePerformances(idsToDelete);

  logger.info("Fetching updated performance datas...");
  // update 관련 로직은 상대적으로 중요도가 낮으므로 새 공연 데이터 삽입이 완료된 이후에 실행
  const idsToUpdate = await getPerformanceIds(
    startDate,
    updateEndDate,
    kopisRateLimiter,
    afterDate,
  );

  await fetchAndInsertPerformances(
    idsToUpdate,
    kopisRateLimiter,
    "updated datas",
  );
})();
