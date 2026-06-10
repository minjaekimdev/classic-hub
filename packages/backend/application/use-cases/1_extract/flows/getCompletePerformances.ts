import logger from "@/shared/utils/logger";
import { kopisRateLimiter } from "../../../services/kopisRateLimiter";
import { InternalPerformance } from "../types";

interface Dependencies {
  getPerformanceWithBuffer: (id: string) => Promise<InternalPerformance>;
}

export const createGetCompletePerformances = ({
  getPerformanceWithBuffer,
}: Dependencies) => {
  return async (ids: string[]): Promise<InternalPerformance[]> => {
    const result: InternalPerformance[] = [];

    for (const id of ids) {
      try {
        // 주입받은 완제품 함수를 레이트 리미터 위에서 실행합니다.
        const performanceDetail = await kopisRateLimiter.execute(() =>
          getPerformanceWithBuffer(id),
        );
        result.push(performanceDetail);
      } catch (error: unknown) {
        logger.error(`[FETCH_FAIL] Performance fetch failed (ID: ${id})`);
        
        // TODO: failureCollector 로직 추가 필요
      }
    }

    return result;
  };
};
