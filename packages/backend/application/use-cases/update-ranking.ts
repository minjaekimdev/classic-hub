import { callDatabaseFunction } from "@/infrastructure/database";
import {
  API_URL,
  CLASSIC,
  SERVICE_KEY,
} from "@/infrastructure/external-api/kopis";
import dayjs from "dayjs";
import { withErrorHandling } from "utils/error";
import logger from "utils/logger";
import { removeTextProperty } from "../services/preprocessor";
import { Ranking } from "@/models/kopis";
import { kopisFetcher } from "../services/kopis-fetcher";

const END_DATE = dayjs().subtract(1, "day");

const getRanking = async (startDate: string, endDate: string) => {
  return withErrorHandling(
    async () => {
      const parsedData = await kopisFetcher(
        `${API_URL}/boxoffice?service=${SERVICE_KEY}&stdate=${startDate}&eddate=${endDate}&catecode=${CLASSIC}`
      );

      const result = removeTextProperty(
        parsedData.boxofs.boxof
      ) as unknown as Ranking[];

      return result;
    },
    null,
    "kopis"
  );
};

const updateRanking = async (
  period: string,
  startDate: string,
  endDate: string
) => {
  const ranking = await getRanking(startDate, endDate);

  if (!ranking) {
    logger.error(`Ranking Data Fetch Failed: ${startDate} ~ ${endDate}`, {
      service: "kopis",
    });
  } else {
    withErrorHandling(
      async () => {
        await callDatabaseFunction("bulk_update_concert_ranks", {
          period,
          payload: ranking,
        });
      },
      () => {
        logger.error(`Ranking Update Failed: ${startDate} ~ ${endDate}`, {
          service: "supabase",
        });
      }
    );
  }
};

(async () => {
  const endDate = END_DATE.format("YYYYMMDD");
  const weeklyStartdate = END_DATE.subtract(6, "days").format("YYYYMMDD");
  const monthlyStartdate = END_DATE.subtract(29, "days").format("YYYYMMDD");

  await updateRanking("daily", endDate, endDate);
  await updateRanking("weekly", weeklyStartdate, endDate);
  await updateRanking("monthly", monthlyStartdate, endDate);
})();
