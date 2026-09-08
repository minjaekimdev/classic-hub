import { DetailFetchFailure } from "shared/types/sync";
import { PerformanceDetail } from "shared/types/kopis";

export interface GetPerformanceDetailListDeps {
  getPerformanceDetail: (id: string) => Promise<PerformanceDetail>;
  rateLimiter: { execute: <T>(fn: () => Promise<T>) => Promise<T> };
  // 인라인 재시도 백오프와 2차 패스 쿨다운 대기. 테스트에서는 즉시 반환하는 가짜를 주입한다.
  sleep: (ms: number) => Promise<void>;
  log: {
    info: (msg: string) => void;
    warn: (msg: string) => void;
    error: (msg: string) => void;
  };
}

// id 1건당 최대 시도 횟수와 백오프(2차/3차 시도 전 대기)
const MAX_ATTEMPTS = 3;
const RETRY_BACKOFF_MS = [2000, 4000];
// 1차 패스 실패분 전체 재시도 전 쿨다운 — 429류 밀도 제한은 시간을 두고 식은 뒤 재시도가 효과적이다.
const SECOND_PASS_COOLDOWN_MS = 30000;

export interface DetailFetchListResult {
  performances: PerformanceDetail[];
  failures: DetailFetchFailure[];
}

// id를 바탕으로 공연 상세 데이터를 모아 반환하는 함수.
// 개별 실패는 인라인 재시도(3회) → 런 전체 2차 패스(30초 쿨다운)까지 수행하고,
// 그래도 실패한 id는 failures로 반환해 상위에서 artifact로 기록한다 (조용한 유실 방지).
export const createGetPerformanceDetailList = ({
  getPerformanceDetail,
  rateLimiter,
  sleep,
  log,
}: GetPerformanceDetailListDeps) => {
  // id 1건을 최대 3회 시도한다. 모두 실패하면 null을 반환한다.
  const fetchWithRetry = async (
    id: string,
  ): Promise<PerformanceDetail | null> => {
    let lastError: unknown = null;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        return await rateLimiter.execute(() => getPerformanceDetail(id));
      } catch (error) {
        lastError = error;
        if (attempt < MAX_ATTEMPTS) {
          const backoff = RETRY_BACKOFF_MS[attempt - 1];
          log.warn(
            `[KOPIS_RETRY] 상세 페칭 실패 (${attempt}/${MAX_ATTEMPTS}) ID: ${id} — ${backoff / 1000}초 후 재시도 (${error})`,
          );
          await sleep(backoff);
        }
      }
    }
    log.error(`[KOPIS_FAIL] 상세 데이터 조회 실패 (ID: ${id}): ${lastError}`);
    return null;
  };

  const fetchAll = async (
    ids: string[],
  ): Promise<{ fetched: PerformanceDetail[]; failures: DetailFetchFailure[] }> => {
    const fetched: PerformanceDetail[] = [];
    const failures: DetailFetchFailure[] = [];
    for (const [index, id] of ids.entries()) {
      log.info(
        `[KOPIS] 상세 데이터 페칭 중 (${index + 1}/${ids.length}) ID: ${id}`,
      );
      const detail = await fetchWithRetry(id);
      if (detail) {
        fetched.push(detail);
      } else {
        failures.push({
          id,
          error: "DetailFetchError",
          failedAt: new Date().toISOString(),
        });
      }
    }
    return { fetched, failures };
  };

  return async (ids: string[]): Promise<DetailFetchListResult> => {
    log.info(`[PROCESS] ${ids.length}개의 공연 상세 텍스트 데이터 페칭 시작`);

    // 1차 패스
    const { fetched, failures } = await fetchAll(ids);

    // 2차 패스: 1차에서 실패한 id만 쿨다운 후 재시도
    if (failures.length > 0) {
      log.info(
        `[KOPIS] 상세 페칭 2차 패스 시작 — 남은 ${failures.length}건 (${SECOND_PASS_COOLDOWN_MS / 1000}초 쿨다운 후)`,
      );
      await sleep(SECOND_PASS_COOLDOWN_MS);
      const retryIds = failures.map((failure) => failure.id);
      const retried = await fetchAll(retryIds);
      fetched.push(...retried.fetched);
      failures.length = 0;
      failures.push(...retried.failures);
    }

    if (failures.length > 0) {
      log.error(
        `[KOPIS_FAIL] 상세 페칭 최종 실패: ${failures.length}건 (전체 ${ids.length}건 중)`,
      );
    }

    return { performances: fetched, failures };
  };
};
