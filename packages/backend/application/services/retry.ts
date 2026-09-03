import { ProcessResult } from "@/shared/types/sync";
import logger from "@/shared/utils/logger";
import promiseLimiter from "@/shared/utils/promiseLimiter";

// 재시도 대상 1건: 재처리에 필요한 원본 입력 + 최신 실패 결과
export interface RetryFailure<T> {
  input: T;
  result: ProcessResult;
}

// 첫 시도에서 실패한 데이터를 대상으로 지수 백오프 재시도를 수행하는 정책 계층.
// processor를 파라미터로 주입받아, 실패한 원본 입력에 대해 동일한 처리 묶음을 재호출한다.
export const retry = async <T>(
  initialFailures: RetryFailure<T>[],
  processor: (input: T) => Promise<ProcessResult>,
  maxRepeat: number,
) => {
  const retrySuccesses: ProcessResult[] = [];
  let pendingFailures = initialFailures;
  let repeat = 1;

  // 실패 데이터가 있고, 최대 시도 횟수를 넘지 않는 동안 반복
  while (pendingFailures.length > 0 && repeat <= maxRepeat) {
    logger.info(
      `🔄 Starting retry #${repeat}... (Remaining: ${pendingFailures.length})`,
    );

    // 지수적 백오프 대기
    const minute = 2 ** repeat;
    await new Promise((r) => setTimeout(r, 60000 * minute));

    // 동시 실행 5회 제한. promiseLimiter는 입력 순서를 보존하므로 인덱스로 재매칭할 수 있다.
    const results = await promiseLimiter(
      pendingFailures.map((failure) => failure.input),
      processor,
      5,
      1000,
    );

    retrySuccesses.push(...results.filter((result) => result.data !== null));

    // 실패한 데이터만 원본 입력과 함께 남겨 다음 라운드 입력으로 사용
    pendingFailures = pendingFailures
      .map((failure, index) => ({ failure, result: results[index] }))
      .filter((pair) => pair.result.error !== null)
      .map((pair) => ({ input: pair.failure.input, result: pair.result }));

    logger.info(
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
