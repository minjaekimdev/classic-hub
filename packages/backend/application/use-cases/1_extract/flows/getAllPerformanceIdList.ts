import { sendSlackNotification } from "@/shared/utils/monitor";
import { APIError, withErrorHandling } from "shared/utils/error";
import logger from "shared/utils/logger";
import { kopisRateLimiter } from "../../lib/kopisRateLimiter";
import { IKopisService } from "@/infrastructure/kopis/service";
import { createGetPerformanceIdsInPage } from "../infra/getPerformanceIdsInPage";

// 대상 기간동안의 새 공연 데이터 id 배열 리턴하기
// TODO: 테스트 필요
export const createGetAllPerformanceIdList = (kopisService: IKopisService) => {
  const getPerformanceIdsInPage = createGetPerformanceIdsInPage(kopisService);

  return async (
    startDate: string,
    endDate: string,
    afterDate?: string,
  ): Promise<string[]> => {
    const result: string[] = [];
    let page = 1;
    let maxRetries = 3;
    let attempt = 0;

    while (true) {
      try {
        const performanceIdArray = await kopisRateLimiter.execute(async () => {
          return await getPerformanceIdsInPage(
            startDate,
            endDate,
            page,
            afterDate,
          );
        });

        // 페이지별 새 공연 id 배열을 받아올 때 에러가 발생한 경우 (withErrorHandling이 null을 반환했을 때)
        // 해당 페이지부터 다시 실행할 수 있도록 하기
        if (!performanceIdArray) {
          throw new APIError(
            `[KOPIS_FAIL] 최신 공연 데이터 가져오기 실패 (page: ${page})`,
          );
        }

        // 더 이상 데이터가 없는 경우 반복문 빠져나오기
        if (performanceIdArray.length === 0) {
          break;
        }

        // 현황 파악을 위한 로깅(무한루프 등 체크)
        logger.debug(
          `[KOPIS] ${page} 페이지: ${performanceIdArray.length} 개의 데이터`,
        );
        result.push(...performanceIdArray);

        page++;
        attempt = 0; // 페이지가 성공하면 다음 페이지들을 위해 재시도 횟수를 초기화한다.
      } catch (error) {
        attempt++;
        logger.warn(
          `[KOPIS] ${page} 페이지 페칭 실패 (시도 ${attempt}/${maxRetries} | 사유: ${error})`,
        );

        if (attempt >= maxRetries) {
          // 3번 모두 실패하면 그 때 슬랙을 보내고 에러를 throw한다.
          await sendSlackNotification(
            `[KOPIS_FAIL] ${page} 페이지에서 실패하여 전체 프로세스를 중단합니다.`,
          );
          throw new APIError(
            `[KOPIS_FAIL] ${page} 페이지에서 ${maxRetries} 번 재시도 후 실패`,
          );
        }

        const backoffDelay = 3000 * Math.pow(2, attempt - 1);

        logger.info(
          `[KOPIS_BACKOFF] ${backoffDelay / 1000}초 후에 재시도합니다...`,
        );
        await new Promise((resolve) => setTimeout(resolve, backoffDelay));
      }
    }

    return result;
  };
};
