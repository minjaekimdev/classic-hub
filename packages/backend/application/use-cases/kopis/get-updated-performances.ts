import { API_URL, SERVICE_KEY, CLASSIC } from "@/infrastructure/external-api/kopis";
import { getPerformanceIdsInPage } from "./get-performance-ids";
import RateLimiter from "utils/rateLimiter";

const getUpdatedPerformaces = async (
  afterDate: string,
  startDate: string,
  endDate: string,
  rateLimiter: RateLimiter
) => {
  const result = [];

  let page = 1;
  while (true) {
    const api = `${API_URL}/pblprfr?service=${SERVICE_KEY}&stdate=${startDate}&eddate=${endDate}&cpage=${page++}&rows=${100}&shcate=${CLASSIC}&afterdate=${afterDate}`;
    const performanceIdArray = await rateLimiter.execute(async () => {
      return getPerformanceIdsInPage(api);
    });

    // 더 이상 데이터가 없는 경우 반복문 빠져나오기
    if (!performanceIdArray) {
      break;
    }

    // 어제 이후로 업데이트된 페이지당 공연 id를 가져올 때 에러가 발생한 경우
    if (performanceIdArray.length === 0) {
      throw new Error(`KOPIS API updated performance get call failed`);
    }
    result.push(...performanceIdArray);
  }
  return result;
};

export default getUpdatedPerformaces;