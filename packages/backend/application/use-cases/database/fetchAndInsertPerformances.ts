import { insertData } from "@/infrastructure/database";
import { withErrorHandling } from "shared/utils/error";
import logger from "shared/utils/logger";
import { sendSlackNotification } from "shared/utils/monitor";
import { getPerformaceDetailArray } from "../kopis/getPerformanceDetailArray";
import RateLimiter from "shared/utils/rateLimiter";

const fetchAndInsertPerformances = async (
  ids: string[],
  rateLimiter: RateLimiter,
) => {
  // successes: 데이터 처리에 성공한 공연 데이터들의 DB 스키마
  // failures: 데이터 처리에 실패한 공연 데이터들의 id, 에러 내용
  const { successes: processSuccesses, failures: processFailures } =
    await getPerformaceDetailArray(ids, rateLimiter);

  const finalFailures = [];

  if (processSuccesses.length > 0) {
    try {
      await insertData("performances", processSuccesses, "performance_id");
      logger.info(
        `[INSERT_SUCCESS] ${processSuccesses.length} items insert succeeded`,
        { service: "supabase" },
      );
    } catch (error) {
      // DB에 삽입하는 데 실패했다면 그대로 삽입
      finalFailures.push({
        id: null,
        error: "DBInsertError",
        datas: processSuccesses,
      });
      logger.error(`[INSERT_FAIL] ${processSuccesses.length} items failed`, {
        service: "supabase",
      });
    }
  }
  if (processFailures.length > 0) {
    logger.error(
      `[PROCESS_FAIL] ${processFailures.length} performance process failed.`,
      { service: "kopis" },
    );
    await sendSlackNotification(
      `❌ [FETCH_FAIL] ${processFailures.length} performance process failed.`,
    );
    finalFailures.push(...processFailures);
  }

  return finalFailures;
};

export default fetchAndInsertPerformances;
