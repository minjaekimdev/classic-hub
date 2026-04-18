import dayjs from "dayjs";
import { syncPerformanceData } from "../../application/use-cases/orchestrators/syncPerformanceData";

const MAX_REPEAT = 5;

(async () => {
  const now = dayjs();
  const startDate = now.subtract(31, "days").format("YYYYMMDD");
  const endDate = now.add(365, "days").format("YYYYMMDD");
  const afterDate = now.subtract(32, "days").format("YYYYMMDD");
  const updateEndDate = now.add(364, "days").format("YYYYMMDD");

  await syncPerformanceData(
    now,
    startDate,
    endDate,
    afterDate,
    updateEndDate,
    MAX_REPEAT,
  );
})();
