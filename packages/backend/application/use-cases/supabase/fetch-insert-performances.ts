import { insertData } from "@/infrastructure/database";
import { withErrorHandling } from "utils/error";
import logger from "utils/logger";
import { sendSlackNotification } from "utils/monitor";
import { getPerformaceDetailArray } from "../kopis/get-performance-detail";
import RateLimiter from "utils/rateLimiter";

const fetchAndInsertPerformances = async (ids: string[], rateLimiter: RateLimiter, log?: string) => {
  // 데이터 삽입
  const { successes, failures } = await getPerformaceDetailArray(ids, rateLimiter);
  if (successes.length > 0) {
    await withErrorHandling(
      async () => {
        await insertData("performances", successes, "performance_id");
        logger.info(
          `[INSERT_SUCCESS] ${successes.length} items succeeded(${log})`,
          { service: "supabase" },
        );
        await sendSlackNotification(
          `✅ [INSERT_SUCCESS] ${successes.length} items succeeded(${log})`,
        );
      },
      async () => {
        logger.error(`[INSERT_FAIL] ${successes.length} items failed(${log})`, {
          service: "supabase",
        });
        await sendSlackNotification(
          `[INSERT_FAIL] ${successes.length} items failed(${log})`,
        );
      },
    );
  }
  if (failures.length > 0) {
    logger.error(
      `[FETCH_FAIL] ${
        failures.length
      } performance detail fetch failed.(${log}) IDs: ${failures.map((f) => f.id).join(", ")}`,
      { service: "kopis" },
    );
    await sendSlackNotification(
      `❌ [FETCH_FAIL] ${failures.length} performance detail fetch failed.(${log})`,
    );
  }
};

export default fetchAndInsertPerformances;