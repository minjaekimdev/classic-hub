import { sendSlackNotification } from "@/shared/utils/monitor";
import { APIError, withErrorHandling } from "shared/utils/error";
import logger from "shared/utils/logger";
import { kopisRateLimiter } from "../../lib/kopisRateLimiter";
import { IKopisService } from "@/infrastructure/kopis/service";
import { createGetPerformanceIdsInPage } from "../infra/getPerformanceIdsInPage";

// 오늘 ~ 대상 기간동안의 새 공연 데이터 id 배열 리턴하기
// TODO: 페이지네이션 테스트 필요
export const createGetPerformanceIds = (kopisService: IKopisService) => {
  const getPerformanceIdsInPage = createGetPerformanceIdsInPage(kopisService);

  return async (
    startDate: string,
    endDate: string,
    afterDate?: string,
  ): Promise<string[]> => {
    const result: string[] = [];
    let page = 1;

    while (true) {
      // 🟢 2. 주입받은 안전한 함수를 레이트 리미터 위에서 실행합니다.
      const performanceIdArray = await kopisRateLimiter.execute(async () => {
        return await getPerformanceIdsInPage(
          startDate,
          endDate,
          page,
          afterDate,
        );
      });

      // 페이지별 새 공연 id 배열을 받아올 때 에러가 발생한 경우 (withErrorHandling이 null을 반환했을 때)
      if (!performanceIdArray) {
        await sendSlackNotification(
          "❌ [FETCH_FAIL] performance id fetch failed",
        );
        throw new APIError("[FETCH_FAIL] performance id fetch failed");
      }

      let currentPage = page++;

      // 더 이상 데이터가 없는 경우 반복문 빠져나오기
      if (performanceIdArray.length === 0) {
        break;
      }

      // 무한루프 도는지 파악을 위한 로깅
      logger.debug(
        `[FETCH_PAGE] Page ${currentPage}: Found ${performanceIdArray.length} items`,
      );

      result.push(...performanceIdArray);
    }

    return result;
  };
};
