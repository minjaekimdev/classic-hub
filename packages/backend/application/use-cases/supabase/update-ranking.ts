import { callDatabaseFunction } from "@/infrastructure/database";
import { withErrorHandling } from "utils/error";
import logger from "utils/logger";
import { sendSlackNotification } from "utils/monitor";
import getRanking from "../kopis/get-ranking";

const updateRanking = async (
  period: string,
  startDate: string,
  endDate: string,
) => {
  const ranking = await getRanking(startDate, endDate);

  const dateRange = `${startDate} ~ ${endDate}`;
  if (!ranking) {
    logger.error(`[FETCH_FAIL] ranking data fetch failed: ${dateRange}`, {
      service: "kopis",
    });
    await sendSlackNotification(
      `[FETCH_FAIL] ranking data fetch failed: ${dateRange}`,
    );
    return;
  }

  await withErrorHandling(
    async () => {
      await callDatabaseFunction("bulk_update_concert_ranks", {
        period,
        payload: ranking,
      });
      await sendSlackNotification(
        `✅ [UPDATE_SUCCESS] ${period} ranking data update succeeded: ${dateRange}`,
      );
    },
    async () => {
      logger.error(
        `[UPDATE_FAILED] ${period} ranking data update failed: ${dateRange}`,
        {
          service: "supabase",
        },
      );
      await sendSlackNotification(
        `❌ [UPDATE_FAILED] ${period} ranking data update failed: ${dateRange}`,
      );
    },
  );
};

export default updateRanking;
