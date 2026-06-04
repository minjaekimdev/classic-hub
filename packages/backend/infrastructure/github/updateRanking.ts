import dayjs from "dayjs";
import updateRanking from "@/application/use-cases/database/updateRanking";
import { kopisRateLimiter } from "@/application/use-cases/lib/kopisRateLimiter";

(async () => {
  const END_DATE = dayjs().subtract(1, "day");
  const endDate = END_DATE.format("YYYYMMDD");
  const weeklyStartdate = END_DATE.subtract(6, "days").format("YYYYMMDD");
  const monthlyStartdate = END_DATE.subtract(29, "days").format("YYYYMMDD");

  await kopisRateLimiter.execute(async () => {
    await updateRanking("daily", endDate, endDate);
  });
  await kopisRateLimiter.execute(async () => {
    await updateRanking("weekly", weeklyStartdate, endDate);
  });
  await kopisRateLimiter.execute(async () => {
    await updateRanking("monthly", monthlyStartdate, endDate);
  });
})();
