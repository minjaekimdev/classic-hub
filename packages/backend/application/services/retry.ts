import { ProcessResult } from "@/shared/types/sync";
import promiseLimiter from "@/shared/utils/promiseLimiter";

// 재시도 대상 1건: 재처리에 필요한 원본 입력(실패하기 전 상태의 데이터) + 최신 실패 결과
export interface RetryFailure<T> {
  input: T;
  result: ProcessResult;
}

// retry가 의존하는 사이드 이펙트를 모두 주입받는다 (extract flows의 deps 패턴과 동일).
// 사이드 이펙트(import, setTimeout)가 탑레벨에 없으므로 테스트에서 vi.mock 없이
// 결정적(deterministic)으로 검증할 수 있다.
export interface RetryDeps<T> {
  // 실패한 원본 입력에 대해 동일한 처리 묶음(공연 1건 = 이미지 페칭 + 가공)을 재호출하는 함수
  processor: (input: T) => Promise<ProcessResult>;
  // 지수 백오프 대기 (밀리초). 테스트에서는 즉시 반환하는 가짜를 주입해
  // 백오프 시퀀스를 단언 가능한 명세로 만든다.
  sleep: (ms: number) => Promise<void>;
  log: {
    info: (msg: string) => void;
  };
}

const RETRY_CONCURRENCY = 5;
const RETRY_INTERVAL_MS = 1000;

// 첫 시도에서 실패한 데이터를 대상으로 지수 백오프 재시도를 수행하는 정책 계층.
// 재시도 r회차는 2^r 분 대기 후 수행된다 (2/4/8/...분).
export const retry = async <T>(
  initialFailures: RetryFailure<T>[],
  maxRepeat: number,
  { processor, sleep, log }: RetryDeps<T>,
) => {
  const retrySuccesses: ProcessResult[] = [];
  let pendingFailures = initialFailures;
  let repeat = 1;

  // 실패 데이터가 있고, 최대 시도 횟수를 넘지 않는 동안 반복
  while (pendingFailures.length > 0 && repeat <= maxRepeat) {
    log.info(
      `🔄 Starting retry #${repeat}... (Remaining: ${pendingFailures.length})`,
    );

    // 지수적 백오프 대기 (2^repeat 분)
    await sleep(60000 * 2 ** repeat);

    // 동시 실행 5회 제한. promiseLimiter는 입력 순서를 보존하므로 인덱스로 재매칭할 수 있다.
    const results = await promiseLimiter(
      pendingFailures.map((failure) => failure.input),
      processor,
      RETRY_CONCURRENCY,
      RETRY_INTERVAL_MS,
    );

    retrySuccesses.push(...results.filter((result) => result.data !== null));

    // 실패한 데이터만 원본 입력과 함께 남겨 다음 라운드 입력으로 사용
    // attempts는 총 시도 횟수(첫 실패 1회 + 재시도 라운드)를 누적하고,
    // failedAt은 마지막 실패 시각으로 갱신한다.
    pendingFailures = pendingFailures
      .map((failure, index) => ({ failure, result: results[index] }))
      .filter((pair) => pair.result.error !== null)
      .map((pair) => ({
        input: pair.failure.input,
        result: {
          ...pair.result,
          attempts: (pair.failure.result.attempts ?? 1) + 1,
          failedAt: new Date().toISOString(),
        },
      }));

    log.info(
      `Failed Performances (Retry #${repeat}): ${pendingFailures.length}`,
    );
    repeat++;
  }

  // 최종적으로 성공한 결과와 끝까지 실패한 결과를 반환
  return {
    retrySuccesses,
    retryFailures: pendingFailures.map((failure) => failure.result),
  };
};
