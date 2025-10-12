import { updateAllRankingData } from "./ranking-performance";
import { updatePerformanceData } from "./all-performance";

(async function main() {
  console.log("cron 작업을 시작합니다...");

  await updateAllRankingData();
  await updatePerformanceData();

  console.log("모든 작업이 완료되었습니다!");
})();
