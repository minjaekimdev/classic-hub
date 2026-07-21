import { PerformanceDetail } from "shared/types/kopis";

// 모든 사이드 이펙트(getPerformanceDetail, rateLimiter, log)를 주입하여
// 테스트에서 vi.mock 없이 결정적(deterministic)으로 검증할 수 있다.
export interface GetPerformanceDetailListDeps {
  getPerformanceDetail: (id: string) => Promise<PerformanceDetail>;
  rateLimiter: { execute: <T>(fn: () => Promise<T>) => Promise<T> };
  log: {
    info: (msg: string) => void;
    error: (msg: string) => void;
  };
}

// id를 바탕으로 getPerformanceDetail 함수를 호출하여 상세 데이터를 모아 반환하는 함수
export const createGetPerformanceDetailList = ({
  getPerformanceDetail,
  rateLimiter,
  log,
}: GetPerformanceDetailListDeps) => {
  return async (ids: string[]): Promise<PerformanceDetail[]> => {
    const result: PerformanceDetail[] = [];

    log.info(
      `[PROCESS] ${ids.length}개의 공연 상세 텍스트 데이터 페칭 시작`,
    );

    for (const id of ids) {
      try {
        const rawData = await rateLimiter.execute(() =>
          getPerformanceDetail(id),
        );

        result.push(rawData);
      } catch (error: unknown) {
        log.error(`[KOPIS_FAIL] 상세 데이터 조회 실패 (ID: ${id})`);
        // TODO: failureCollector 로직 추가 필요
      }
    }

    return result;
  };
};
