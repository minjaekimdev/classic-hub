import { kopisFetcher } from "./utils/fetcher";
import { removeTextProperty } from "./utils/preprocessor";
import { API_URL, SERVICE_KEY, CLASSIC } from "./client";
import {
  PerformanceDetail,
  PerformanceSummary,
  Ranking,
} from "shared/types/kopis";

// KOPIS API를 찔러서 데이터 하나를 순수하게 가져온다는 단건 조회 기능만 가지고 있으면 됨
// getPerformanceWithBuffer, getPerformanceList 등의 함수는 비즈니스 로직이 포함되어 있으므로 X
// 데이터 변환에 필요한 전처리까지를 이곳 인프라 코드에서 수행한다.
export interface IKopisService {
  getRanking(startDate: string, endDate: string): Promise<Ranking[]>;
  getPerformanceIdsInPage(
    startDate: string,
    endDate: string,
    page: number,
    afterDate?: string,
  ): Promise<string[]>;
  getPerformanceDetail(performanceId: string): Promise<PerformanceDetail>;
  getFacilityIdsInPage(page: number): Promise<string[]>;
}

// 실제 KOPIS API와 통신하는 구현체
export const kopisService: IKopisService = {
  async getRanking(startDate: string, endDate: string) {
    const parsedData = await kopisFetcher(
      `${API_URL}/boxoffice?service=${SERVICE_KEY}&stdate=${startDate}&eddate=${endDate}&catecode=${CLASSIC}`,
    );

    return removeTextProperty(parsedData.boxofs.boxof) as unknown as Ranking[];
  },

  async getPerformanceIdsInPage(
    startDate: string,
    endDate: string,
    page: number,
    afterDate?: string,
  ) {
    const parsedData = await kopisFetcher(
      `${API_URL}/pblprfr?service=${SERVICE_KEY}&stdate=${startDate}&eddate=${endDate}&cpage=${page}&rows=${100}&shcate=${CLASSIC}${afterDate ? `&afterdate=${afterDate}` : ""}`,
    );

    // API 요청에는 성공했으나 더이상 데이터가 없는 경우, 빈 배열 리턴
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

  async getPerformanceDetail(performanceId: string) {
    const parsedData = await kopisFetcher(
      `${API_URL}/pblprfr/${performanceId}?service=${SERVICE_KEY}`,
    );
    return removeTextProperty(
      parsedData.dbs.db,
    ) as unknown as PerformanceDetail;
  },

  async getFacilityIdsInPage(page: number) {
    const parsedData = await kopisFetcher(
      `${API_URL}/prfplc?service=${SERVICE_KEY}&cpage=${page}&rows=100`,
    );

    if (!parsedData.dbs.db) return [];

    const processedResult = removeTextProperty(parsedData.dbs.db);
    const facilitySummaryArray = (
      Array.isArray(processedResult) ? processedResult : [processedResult]
    ) as any[];

    return facilitySummaryArray.map((item) => item.mt10id);
  },
};
