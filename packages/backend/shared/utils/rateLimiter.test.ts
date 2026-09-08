import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import RateLimiter from "./rateLimiter";

describe("RateLimiter", () => {
  beforeEach(() => {
    // 가짜 타이머 사용
    // setTimeout, setInterval, clearTimeout, Date.now()를
    // Vitest가 만든 가짜 함수로 갈아치운다.
    vi.useFakeTimers();
  });

  afterEach(() => {
    // 다시 시스템 시계를 사용하도록 되돌려야 한다.
    vi.useRealTimers();
  });

  it("설정된 지연 시간만큼 대기하며 순차적으로 실행해야 한다", async () => {
    const limiter = new RateLimiter(60); // 분당 60회 = 1초에 1회 실행
    const results: number[] = [];

    // 3개의 작업을 동시에 넣음
    const task1 = limiter.execute(async () => results.push(1));
    const task2 = limiter.execute(async () => results.push(2));
    const task3 = limiter.execute(async () => results.push(3));

    // 첫 번째는 즉시 실행되지만 두 번째부터는 대기 상태
    // advanceTimersByTimeAsync: 인자로 넣은 ms만큼 시계를 강제로 앞으로 돌린다.
    // 단순 advanceTimersByTime은 setTimeout만 하고 끝나지만,
    // async가 붙으면 대기 중인 모든 Promise 로직들까지 전부 처리한다.
    await vi.advanceTimersByTimeAsync(0);
    expect(results).toEqual([1]);

    // 1초 뒤에 두 번째 실행
    await vi.advanceTimersByTimeAsync(1000);
    expect(results).toEqual([1, 2]);

    // 또 1초 뒤에 세 번째 실행
    await vi.advanceTimersByTimeAsync(1000);
    expect(results).toEqual([1, 2, 3]);

    await Promise.all([task1, task2, task3]);
  });

  it("작업이 실패해도 다음 작업은 계속 진행되어야 한다", async () => {
    const limiter = new RateLimiter(600); // 100ms마다 실행

    const failTask = limiter.execute(async () => {
      throw new Error("Fail");
    });
    const successTask = limiter.execute(async () => "Success");
    failTask.catch(() => {});
    // 1. 첫 번째 작업(실패)이 끝난 후, 다음 작업을 위한 딜레이를 건너뛰기 위해 시계를 돌려줍니다.
    // 이 한 줄이 없으면 테스트는 여기서 영원히 멈춥니다.
    await vi.advanceTimersByTimeAsync(100);

    // 2. 이제야 비로소 결과들을 확인할 수 있습니다.
    await expect(failTask).rejects.toThrow("Fail");
    await expect(successTask).resolves.toBe("Success");
  });
});
