import dayjs from "dayjs";
import logger from "@/shared/utils/logger";
import { sendSlackNotification } from "@/shared/utils/monitor";
import { syncPerformanceData } from "../../application/use-cases/orchestrator";

const MAX_REPEAT = 5;

(async () => {
  const now = dayjs();
  const startDate = now.subtract(31, "days").format("YYYYMMDD");
  const endDate = now.add(365, "days").format("YYYYMMDD");
  const afterDate = now.subtract(32, "days").format("YYYYMMDD");
  const updateEndDate = now.add(364, "days").format("YYYYMMDD");

  try {
    const summary = await syncPerformanceData(
      startDate,
      endDate,
      afterDate,
      updateEndDate,
      MAX_REPEAT,
    );

    // 조용한 실패 방지: 끝까지 실패한 데이터가 있거나 DB 적재가 실패한 날은
    // Actions 히스토리에 실패로 기록되게 한다.
    if (summary.finalFailures.length > 0 || !summary.insertSucceeded) {
      process.exitCode = 1;
    }
  } catch (error) {
    // extract 단계 실패 등 파이프라인 자체의 크래시.
    // 성공 요약이 오지 않는 날과 구별되도록 크래시 알림을 별도로 보낸다.
    logger.error("[SYNC_CRASH] 공연 동기화 실행이 비정상 종료됐습니다.", error);
    await sendSlackNotification(
      "❌ 공연 동기화 실행이 비정상 종료됐습니다. Actions 로그를 확인해주세요.",
    );
    process.exitCode = 1;
  }
})();
