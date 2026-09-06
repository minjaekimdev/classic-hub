import { callDatabaseFunction } from "@/infrastructure/supabase/database";
import { withErrorHandling } from "shared/utils/error";
import logger from "shared/utils/logger";
import { sendSlackNotification } from "shared/utils/monitor";
import { kopisService } from "@/infrastructure/kopis/service";
import { createGetRanking } from "../1_extract/infra/getRanking";

const getRanking = createGetRanking(kopisService);

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
