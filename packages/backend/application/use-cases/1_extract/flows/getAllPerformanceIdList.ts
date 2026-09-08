import { APIError } from "shared/utils/error";

// 최소한의 역할만 정의한 포트 (서비스 통째로 주입 X)
// 모든 사이드 이펙트(fetchPage, rateLimiter, notify, log, sleep)를 주입하여
// 테스트에서 vi.mock 없이 결정적(deterministic)으로 검증할 수 있다.
export interface GetAllPerformanceIdListDeps {
  fetchPage: (
    startDate: string,
    endDate: string,
    page: number,
    afterDate?: string,
  ) => Promise<string[]>;
  rateLimiter: { execute: <T>(fn: () => Promise<T>) => Promise<T> };
  notify: (message: string) => Promise<unknown> | unknown;
  log: {
    debug: (msg: string) => void;
    warn: (msg: string) => void;
    info: (msg: string) => void;
  };
  sleep: (ms: number) => Promise<void>;
}

const MAX_RETRIES = 3;

// 대상 기간동안의 새 공연 데이터 id 배열 리턴하기
// 의존성은 모두 deps 객체로 주입받으며, 모듈 탑레벨 import가 0개다.
export const createGetAllPerformanceIdList = (
  deps: GetAllPerformanceIdListDeps,
) => {
  const { fetchPage, rateLimiter, notify, log, sleep } = deps;

  return async (
    startDate: string,
    endDate: string,
    afterDate?: string,
  ): Promise<string[]> => {
    const result: string[] = [];
    let page = 1;
    let attempt = 0;

    while (true) {
      try {
        const performanceIdArray = await rateLimiter.execute(() =>
          fetchPage(startDate, endDate, page, afterDate),
        );

        // 더 이상 데이터가 없는 경우 반복문 빠져나오기
        if (performanceIdArray.length === 0) {
          break;
        }

        // 페이지별 진행 로그: 몇 페이지째인지와 누적 건수를 남겨 페칭 속도·볼륨을 추적한다.
        log.info(
          `[KOPIS] ${page}페이지 페칭 완료: ${performanceIdArray.length}건 (누적 ${result.length}건)`,
        );
        result.push(...performanceIdArray);

        page++;
        attempt = 0; // 페이지가 성공하면 다음 페이지들을 위해 재시도 횟수 초기화
      } catch (error) {
        attempt++;
        log.warn(
          `[KOPIS] ${page} 페이지 페칭 실패 (시도 ${attempt}/${MAX_RETRIES} | 사유: ${error})`,
        );

        if (attempt >= MAX_RETRIES) {
          // 3번 모두 실패하면 알림 전송 후 에러 throw
          await notify(
            `❌ [KOPIS_FAIL] ${page} 페이지에서 실패하여 전체 프로세스를 중단합니다.`,
          );
          throw new APIError(
            `[KOPIS_FAIL] ${page} 페이지에서 ${MAX_RETRIES} 번 재시도 후 실패`,
          );
        }

        const backoffDelay = 3000 * Math.pow(2, attempt - 1);
        log.info(`[KOPIS_RETRY] ${backoffDelay / 1000}초 후에 재시도합니다...`);
        await sleep(backoffDelay);
      }
    }

    log.info(
      `[KOPIS_SUCCESS] 공연 목록 페칭 완료: 총 ${page - 1}페이지 / ${result.length}건`,
    );

    return result;
  };
};
