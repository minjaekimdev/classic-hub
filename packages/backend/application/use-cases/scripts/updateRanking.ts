import { callDatabaseFunction } from "@/infrastructure/supabase/database";
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

  // 적재 실패는 삼켜서 알림만 보낸다. daily/weekly/monthly가 순차 실행되므로
  // 한 period의 실패가 나머지 period 처리까지 죽이면 안 된다.
  try {
    await callDatabaseFunction("bulk_update_concert_ranks", {
      period,
      payload: ranking,
    });
  } catch {
    logger.error(
      `[UPDATE_FAILED] ${period} ranking data update failed: ${dateRange}`,
      {
        service: "supabase",
      },
    );
    await sendSlackNotification(
      `❌ [UPDATE_FAILED] ${period} ranking data update failed: ${dateRange}`,
    );
  }
};

export default updateRanking;
