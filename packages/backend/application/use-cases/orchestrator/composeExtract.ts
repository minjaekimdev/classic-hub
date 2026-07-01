// 컴포지션 루트: 실제 인프라 구현체를 주입해서 '실제' use-case 함수를 생성한다.
// 앱 전체에서 create* 팩토리를 직접 부르지 않고 이곳에서 만든 함수를 사용한다.
import { kopisRateLimiter } from "@/application/services/kopisRateLimiter";
import { sendSlackNotification } from "@/shared/utils/monitor";
import logger from "@/shared/utils/logger";
import { kopisService } from "@/infrastructure/kopis/service";
import { createGetPerformanceIdsInPage } from "../1_extract/infra/getPerformanceIdsInPage";
import { createGetAllPerformanceIdList } from "../1_extract/flows/getAllPerformanceIdList";

// KOPIS에서 한 페이지의 id를 가져오는 실제 구현 (withErrorHandling 래핑 포함)
const fetchPage = createGetPerformanceIdsInPage(kopisService);

// 실제 의존성을 모두 주입하여 '실제' getAllPerformanceIdList 생성
export const getAllPerformanceIdList = createGetAllPerformanceIdList({
  fetchPage,
  rateLimiter: kopisRateLimiter,
  notify: sendSlackNotification,
  log: logger,
  sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
});
