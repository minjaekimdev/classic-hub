import logger from "@/shared/utils/logger";
import { failureCollector } from "../../shared/failureCollector";
import { kopisRateLimiter } from "../../../services/kopisRateLimiter";
import { PerformanceDetail } from "shared/types/kopis";

interface GetPerformanceDetailsDependencies {
  getPerformanceDetail: (id: string) => Promise<PerformanceDetail>;
}

// id를 바탕으로 getPerformanceDetail 함수를 호출하여 상세 데이터를 모아 반환하는 함수
export const createGetPerformanceDetailList = ({
  getPerformanceDetail,
}: GetPerformanceDetailsDependencies) => {
  return async (ids: string[]): Promise<PerformanceDetail[]> => {
    const result: PerformanceDetail[] = [];

    logger.info(
      `[PROCESS] ${ids.length}개의 공연 상세 텍스트 데이터 페칭 시작`,
    );

    for (const id of ids) {
      try {
        const rawData = await kopisRateLimiter.execute(() =>
          getPerformanceDetail(id),
        );

        result.push(rawData);
      } catch (error: unknown) {
        logger.error(`[KOPIS_FAIL] 상세 데이터 조회 실패 (ID: ${id})`);

        if (error instanceof Error) {
          failureCollector.add(id, "EXTRACT", error.message);
        } else {
          failureCollector.add(id, "EXTRACT", String(error));
        }
      }
    }

    return result;
  };
};
