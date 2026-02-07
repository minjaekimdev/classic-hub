import dayjs from "dayjs";
import { APIError, withErrorHandling } from "utils/error";
import { getColumnData } from "@/infrastructure/database";
import logger from "utils/logger";
import { sendSlackNotification } from "utils/monitor";
import { getPerformanceIds } from "../../application/use-cases/kopis/get-performance-ids";
import getUpdatedPerformaces from "../../application/use-cases/kopis/get-updated-performances";
import deletePerformances from "../../application/use-cases/supabase/delete-performances";
import fetchAndInsertPerformances from "@/application/use-cases/supabase/fetch-insert-performances";
import RateLimiter from "utils/rateLimiter";

(async () => {
  const now = dayjs();
  const startDate = now.format("YYYYMMDD");
  const endDate = now.add(365, "days").format("YYYYMMDD");
  const afterDate = now.subtract(1, "days").format("YYYYMMDD");
  const updateEndDate = now.add(364, "days").format("YYYYMMDD");

  const kopisRateLimiter = new RateLimiter(300);

  const newPerformances = await withErrorHandling(async () => {
    const result = await getPerformanceIds(
      startDate,
      endDate,
      kopisRateLimiter,
    );

    if (result.length === 0) {
      logger.error("[FETCH_FAIL] new data fetch failed", {
        service: "kopis",
      });
      await sendSlackNotification("❌ [FETCH_FAIL] new data fetch failed");
      throw new APIError("[FETCH_FAIL] new data fetch failed");
    }

    return result;
  }); // 추후 업데이트에도 영향을 미치므로 fallback을 지정하지 않음

  const dbPerformances = await withErrorHandling(
    async () => {
      return await getColumnData("performances", "performance_id");
    },
    async () => {
      logger.error("[FETCH_FAIL] old DB data fetch failed", {
        service: "supabase",
      });
      await sendSlackNotification("❌ [FETCH_FAIL] old DB data fetch failed");
      throw new Error("[FETCH_FAIL] old DB data fetch failed");
    },
  );

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

  await deletePerformances(idsToDelete);
  await fetchAndInsertPerformances(idsToInsert, kopisRateLimiter, "new datas");

  // update 관련 로직은 상대적으로 중요도가 낮으므로 새 공연 데이터 삽입이 완료된 이후에 실행
  const idsToUpdate = await getUpdatedPerformaces(
    afterDate,
    startDate,
    updateEndDate,
    kopisRateLimiter
  );

  await fetchAndInsertPerformances(
    idsToUpdate,
    kopisRateLimiter,
    "updated datas",
  );
})();
