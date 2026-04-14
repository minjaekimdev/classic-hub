import { ProcessResult } from "@/shared/types/sync";
import logger from "@/shared/utils/logger";
import promiseLimiter from "@/shared/utils/promiseLimiter";
import { processPerformance } from "./processPerformance";

export const retry = async (
  initialFailures: Array<ProcessResult>,
  maxRepeat: number,
) => {
  const retrytransformSuccesses = [];
  let retryFailures = initialFailures;
  let repeat = 1;

  // 실패 데이터가 있고, 최대 시도 횟수를 넘지 않는 동안 반복
  while (retryFailures.length > 0 && repeat <= maxRepeat) {
    logger.info(
      `🔄 Starting retry #${repeat}... (Remaining: ${retryFailures.length})`,
    );

    // 지수적 백오프 대기
    const minute = 2 ** repeat;
    await new Promise((r) => setTimeout(r, 60000 * minute));

    // 동시 실행 5회 제한
    const results = await promiseLimiter(
      retryFailures.map((failure) => failure.id),
      processPerformance,
      5,
      1000,
    );

    retrytransformSuccesses.push(
      ...results.filter((result) => result.data).map((item) => item.data),
    );

    // 만약 에러 없이 모두 성공했다면 (undefined 반환 시) 빈 배열로 치환해서 종료
    // 실패한 데이터 기록 시 날짜도 같이 저장해야 할듯?
    const nowFailures = results.filter((result) => result.error);
    console.log(`Failed Performances (Retry #${repeat}):`, nowFailures);
    retryFailures = nowFailures;
    repeat++;
  }

  return { retrytransformSuccesses, retryFailures }; // 최종적으로 성공, 실패한 목록 반환
};
