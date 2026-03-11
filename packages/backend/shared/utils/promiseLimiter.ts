import pLimit from "p-limit";

// 1. 간단한 지연 함수 (ms 단위)
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * @param items - 처리할 데이터 배열
 * @param taskFn - 비동기 함수
 * @param concurrency - 동시 실행 수 (기본 5)
 * @param interval - 각 작업 사이의 최소 대기 시간 (ms, 기본 0)
 */
const promiseLimiter = async <T, R>(
  items: T[],
  taskFn: (item: T) => Promise<R>,
  concurrency: number = 5,
  interval: number = 0,
): Promise<R[]> => {
  const limit = pLimit(concurrency);

  const tasks = items.map((item, index) => {
    return limit(async () => {
      // 작업 시작 전 지연
      if (interval > 0) {
        await sleep(interval);
      }

      return taskFn(item);
    });
  });

  return Promise.all(tasks);
};

export default promiseLimiter;
