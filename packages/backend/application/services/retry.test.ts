import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { retry, RetryDeps, RetryFailure } from "./retry";
import { ProcessResult } from "shared/types/sync";

const failResult = (id: string, error = "OCRError"): ProcessResult => ({
  id,
  error,
  data: null,
});

const successResult = (id: string): ProcessResult => ({
  id,
  error: null,
  data: {} as ProcessResult["data"],
});

const makeFailure = (input: string): RetryFailure<string> => ({
  input,
  result: failResult(input),
});

// 헬퍼: 테스트에서의 deps 스텁을 쉽게 만든다. 필요한 부분만 overrides로 교체.
// sleep은 즉시 반환하므로 백오프 대기 없이 백오프 시퀀스를 단언할 수 있다.
const makeDeps = (
  overrides: Partial<RetryDeps<string>> = {},
): RetryDeps<string> => ({
  processor: vi.fn(),
  sleep: vi.fn().mockResolvedValue(undefined),
  log: { info: vi.fn() },
  ...overrides,
});

// retry 내부의 promiseLimiter는 setTimeout 기반 interval(1초)로 실제 대기하므로
// 가짜 타이머로 즉시 소진한다. 백오프 sleep은 deps로 주입된 가짜를 그대로 사용한다.
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

// retry를 시작한 뒤 대기 중인 타이머를 모두 소진하고 결과를 반환한다.
const runRetry = (
  input: RetryFailure<string>[],
  maxRepeat: number,
  deps: RetryDeps<string>,
) => {
  const promise = retry(input, maxRepeat, deps);
  return vi.runAllTimersAsync().then(() => promise);
};

describe("retry 비즈니스 로직 테스트", () => {
  // 시나리오 1: 첫 재시도에서 모두 성공 → 백오프 1회 후 종료
  it("실패 데이터가 첫 재시도에서 모두 성공하면 백오프 1회(2분) 후 종료한다", async () => {
    const processor = vi
      .fn()
      .mockImplementation((id: string) => Promise.resolve(successResult(id)));
    const sleep = vi.fn().mockResolvedValue(undefined);

    const result = await runRetry(
      [makeFailure("PF1"), makeFailure("PF2")],
      3,
      makeDeps({ processor, sleep }),
    );

    // 백오프 명세: r회차 = 2^r 분 → 1회차 = 2분 = 120000ms
    expect(sleep).toHaveBeenCalledTimes(1);
    expect(sleep).toHaveBeenCalledWith(120000);
    expect(processor).toHaveBeenCalledTimes(2);
    expect(result.retrySuccesses).toHaveLength(2);
    expect(result.retryFailures).toHaveLength(0);
  });

  // 시나리오 2: 끝까지 실패 → 백오프 2/4/8분 후 포기
  it("maxRepeat=3까지 모두 실패하면 백오프 2/4/8분 후 포기하고 실패 목록을 반환한다", async () => {
    const processor = vi
      .fn()
      .mockImplementation((id: string) => Promise.resolve(failResult(id)));
    const sleep = vi.fn().mockResolvedValue(undefined);

    const result = await runRetry(
      [makeFailure("PF1"), makeFailure("PF2")],
      3,
      makeDeps({ processor, sleep }),
    );

    // 백오프 명세: 2^r 분 = 120000, 240000, 480000ms
    expect(sleep).toHaveBeenCalledTimes(3);
    expect(sleep).toHaveBeenNthCalledWith(1, 120000);
    expect(sleep).toHaveBeenNthCalledWith(2, 240000);
    expect(sleep).toHaveBeenNthCalledWith(3, 480000);
    expect(processor).toHaveBeenCalledTimes(6); // 2건 × 3회
    expect(result.retrySuccesses).toHaveLength(0);
    expect(result.retryFailures).toHaveLength(2);
  });

  // 시나리오 3: 입력 보존 — 실패한 원본 입력이 processor에 그대로 전달
  it("실패한 원본 입력이 processor에 그대로 전달된다", async () => {
    const processor = vi
      .fn()
      .mockImplementation((id: string) => Promise.resolve(successResult(id)));

    await runRetry(
      [makeFailure("PF_A"), makeFailure("PF_B")],
      2,
      makeDeps({ processor }),
    );

    expect(processor).toHaveBeenNthCalledWith(1, "PF_A");
    expect(processor).toHaveBeenNthCalledWith(2, "PF_B");
  });

  // 시나리오 4: 라운드별 정리 — 이전 라운드 성공분은 다음 재시도에서 제외
  it("이전 라운드에서 성공한 데이터는 다음 재시도에서 제외된다", async () => {
    // 1회차: PF1 성공, PF2 실패 → 2회차: PF2만 재시도되어 성공
    const processor = vi
      .fn()
      .mockResolvedValueOnce(successResult("PF1"))
      .mockResolvedValueOnce(failResult("PF2"))
      .mockResolvedValueOnce(successResult("PF2"));
    const sleep = vi.fn().mockResolvedValue(undefined);

    const result = await runRetry(
      [makeFailure("PF1"), makeFailure("PF2")],
      3,
      makeDeps({ processor, sleep }),
    );

    expect(sleep).toHaveBeenCalledTimes(2); // 1회차(2분), 2회차(4분)
    expect(processor).toHaveBeenCalledTimes(3); // 1회차 2건 + 2회차 1건
    expect(result.retrySuccesses).toHaveLength(2);
    expect(result.retryFailures).toHaveLength(0);
  });

  // 시나리오 5: 재시도할 실패가 없으면 아무 일도 일어나지 않는다
  it("재시도할 실패가 없으면 sleep과 processor를 호출하지 않는다", async () => {
    const processor = vi.fn();
    const sleep = vi.fn().mockResolvedValue(undefined);

    const result = await runRetry([], 3, makeDeps({ processor, sleep }));

    expect(sleep).not.toHaveBeenCalled();
    expect(processor).not.toHaveBeenCalled();
    expect(result.retrySuccesses).toEqual([]);
    expect(result.retryFailures).toEqual([]);
  });

  // 시나리오 6: maxRepeat=0 → 재시도 없이 즉시 포기
  it("maxRepeat=0이면 재시도 없이 실패 결과를 그대로 반환한다", async () => {
    const processor = vi.fn();
    const sleep = vi.fn().mockResolvedValue(undefined);

    const result = await runRetry(
      [makeFailure("PF1")],
      0,
      makeDeps({ processor, sleep }),
    );

    expect(sleep).not.toHaveBeenCalled();
    expect(processor).not.toHaveBeenCalled();
    expect(result.retryFailures).toEqual([failResult("PF1")]);
  });

  // 시나리오 7: 입력 순서와 결과의 매칭 — 성공/실패가 섞여도 인덱스 재매칭이 어긋나지 않는다
  it("성공과 실패가 섞여 있어도 입력 순서와 결과가 올바르게 매칭된다", async () => {
    const processor = vi.fn().mockImplementation((id: string) =>
      id === "PF_MID"
        ? Promise.resolve(failResult(id, "GeminiError"))
        : Promise.resolve(successResult(id)),
    );

    const result = await runRetry(
      [makeFailure("PF_A"), makeFailure("PF_MID"), makeFailure("PF_C")],
      1,
      makeDeps({ processor }),
    );

    expect(result.retryFailures).toHaveLength(1);
    expect(result.retryFailures[0].id).toBe("PF_MID");
    expect(result.retryFailures[0].error).toBe("GeminiError");
    expect(result.retrySuccesses).toHaveLength(2);
  });
});
