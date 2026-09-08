import dayjs from "dayjs";
import logger from "shared/utils/logger";
import { sendSlackNotification } from "shared/utils/monitor";
import { callDatabaseFunction } from "@/infrastructure/supabase/database";
import { kopisService } from "@/infrastructure/kopis/service";
import { kopisRateLimiter } from "@/application/services/kopisRateLimiter";
import { createUpdateRanking } from "@/application/use-cases/scripts/updateRanking";
import { getRankingPeriodRanges } from "./rankingPeriods";

// 컴포지션: 실제 인프라 구현체를 주입해 최상위 use-case를 만든다.
const updateRanking = createUpdateRanking({
  getRanking: (startDate, endDate) => kopisService.getRanking(startDate, endDate),
  updateRanks: (period, payload) =>
    callDatabaseFunction("bulk_update_concert_ranks", { period, payload }),
  log: logger,
  notify: sendSlackNotification,
});

(async () => {
  const ranges = getRankingPeriodRanges(dayjs().subtract(1, "day"));

  for (const { period, startDate, endDate } of ranges) {
    await kopisRateLimiter.execute(async () => {
      await updateRanking(period, startDate, endDate);
    });
  }
})();
