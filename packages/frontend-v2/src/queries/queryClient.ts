import { QueryClient, keepPreviousData } from "@tanstack/react-query";

/** 공연 편성 데이터는 실시간성이 낮음 (KOPIS 주기 갱신) */
const STALE_TIME_MS = 5 * 60 * 1000;
const MAX_RETRY_COUNT = 3;

/** 4xx는 재시도 없음, 5xx/네트워크는 백오프 재시도 */
const retry = (failureCount: number, error: unknown) => {
  const status = (error as { status?: number }).status;
  if (typeof status === "number" && status >= 400 && status < 500) return false;
  return failureCount < MAX_RETRY_COUNT;
};

/** SSR에서 모듈 최상단 생성 시 캐시가 요청 간 공유되는 사고를 막기 위한 팩토리 */
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: STALE_TIME_MS,
        retry,
        placeholderData: keepPreviousData,
      },
    },
  });
}
