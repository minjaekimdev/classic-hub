import { kopisFetcher } from "@/application/services/kopisFetcher";
import { removeTextProperty } from "@/application/services/kopisPreprocessor";
import {
  API_URL,
  SERVICE_KEY,
  CLASSIC,
} from "@/infrastructure/external-api/kopis";
import { sendSlackNotification } from "@/shared/utils/monitor";
import { PerformanceSummary } from "shared/types/kopis";
import { APIError, withErrorHandling } from "shared/utils/error";
import logger from "shared/utils/logger";
import { kopisRateLimiter } from "../../lib/kopisRateLimiter";

export const getPerformanceIdsInPage = async (api: string) => {
  return withErrorHandling(
    async () => {
      const parsedData = await kopisFetcher(api);

      // API 요청에는 성공했으나 더이상 데이터가 없는 경우
      if (!parsedData.dbs.db) {
        return [];
      }

      // _text 프로퍼티를 제거하여 순수 공연 id만으로 이루어진 배열 반환
      const processedResult = removeTextProperty(parsedData.dbs.db);
      const performanceSummaryArray = (Array.isArray(processedResult)
        ? processedResult
        : [processedResult]) as unknown as PerformanceSummary[];

      return performanceSummaryArray.map(
        (item: PerformanceSummary) => item.mt20id,
      );
    },
    null,
    "kopis",
  );
};

// 오늘 ~ 대상 기간동안의 새 공연 데이터 id 배열 리턴하기
export const getPerformanceIds = async (
  startDate: string,
  endDate: string,
  afterDate?: string,
): Promise<Array<string>> => {
  const result = [];

  let page = 1;
  while (true) {
    const api = `${API_URL}/pblprfr?service=${SERVICE_KEY}&stdate=${startDate}&eddate=${endDate}&cpage=${page}&rows=${100}&shcate=${CLASSIC}${afterDate ? `&afterdate=${afterDate}` : ""}`;
    const performanceIdArray = await kopisRateLimiter.execute(async () => {
      return await getPerformanceIdsInPage(api);
    });

    // 페이지별 새 공연 id 배열을 받아올 때 에러가 발생한 경우 빈 배열 리턴
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
