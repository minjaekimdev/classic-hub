import { describe, it, expect, vi } from "vitest";
import {
  createGetPerformanceDetailList,
  GetPerformanceDetailListDeps,
} from "./getPerformanceDetailList";
import { PerformanceDetail } from "shared/types/kopis";

// 헬퍼: 테스트에서의 deps 스텁을 쉽게 만든다. 필요한 부분만 overrides로 교체.
const makeDeps = (
  overrides: Partial<GetPerformanceDetailListDeps> = {},
): GetPerformanceDetailListDeps => ({
  getPerformanceDetail: vi.fn(),
  // 기본적으로 rateLimiter는 들어온 fn을 그대로 실행 (통과)
  rateLimiter: {
    execute: vi.fn(<T>(fn: () => Promise<T>) => fn()) as any,
  },
  log: { info: vi.fn(), error: vi.fn() },
  ...overrides,
});

// 헬퍼: 최소한의 PerformanceDetail 스텁 생성
const makeDetail = (id: string): PerformanceDetail =>
  ({ mt20id: id } as unknown as PerformanceDetail);

describe("getPerformanceDetailList 비즈니스 로직 테스트", () => {
  // 시나리오 1: 정상 흐름
  it("모든 id에 대해 getPerformanceDetail을 호출하여 상세 데이터 배열을 반환해야 한다", async () => {
    const getPerformanceDetail = vi
      .fn()
      .mockResolvedValueOnce(makeDetail("ID_1"))
      .mockResolvedValueOnce(makeDetail("ID_2"));

    const getPerformanceDetailList = createGetPerformanceDetailList(
      makeDeps({ getPerformanceDetail }),
    );
    const result = await getPerformanceDetailList(["ID_1", "ID_2"]);

    expect(result).toEqual([makeDetail("ID_1"), makeDetail("ID_2")]);
    expect(getPerformanceDetail).toHaveBeenCalledTimes(2);
  });

  // 시나리오 2: 일부 id 실패 시 에러를 삼키고 성공한 것만 반환
  it("중간 id 조회가 실패해도 에러를 로깅하고 나머지 성공 데이터만 반환해야 한다", async () => {
    const getPerformanceDetail = vi
      .fn()
      .mockResolvedValueOnce(makeDetail("ID_1"))
      .mockRejectedValueOnce(new Error("KOPIS 일시 에러"))
      .mockResolvedValueOnce(makeDetail("ID_3"));
    const log = { info: vi.fn(), error: vi.fn() };

    const getPerformanceDetailList = createGetPerformanceDetailList(
      makeDeps({ getPerformanceDetail, log }),
    );
    const result = await getPerformanceDetailList(["ID_1", "ID_2", "ID_3"]);

    expect(result).toEqual([makeDetail("ID_1"), makeDetail("ID_3")]);
    expect(log.error).toHaveBeenCalledWith(
      expect.stringContaining("[KOPIS_FAIL] 상세 데이터 조회 실패 (ID: ID_2)"),
    );
  });

  // 시나리오 3: 빈 id 배열
  it("빈 배열이 들어오면 빈 배열을 반환하고 getPerformanceDetail은 호출되지 않아야 한다", async () => {
    const getPerformanceDetail = vi.fn();

    const getPerformanceDetailList = createGetPerformanceDetailList(
      makeDeps({ getPerformanceDetail }),
    );
    const result = await getPerformanceDetailList([]);

    expect(result).toEqual([]);
    expect(getPerformanceDetail).not.toHaveBeenCalled();
  });

  // 시나리오 4: rateLimiter를 통한 실행
  it("각 조회는 rateLimiter.execute를 통해 실행되어야 한다", async () => {
    const execute = vi.fn(<T>(fn: () => Promise<T>) => fn()) as any;
    const rateLimiter = { execute };
    const getPerformanceDetail = vi
      .fn()
      .mockResolvedValueOnce(makeDetail("ID_1"));

    const getPerformanceDetailList = createGetPerformanceDetailList(
      makeDeps({ getPerformanceDetail, rateLimiter }),
    );
    await getPerformanceDetailList(["ID_1"]);

    expect(execute).toHaveBeenCalledTimes(1);
    expect(getPerformanceDetail).toHaveBeenCalledWith("ID_1");
  });

  // 시나리오 5: 페칭 시작 로그
  it("시작 시점에 id 개수를 포함한 info 로그를 남겨야 한다", async () => {
    const log = { info: vi.fn(), error: vi.fn() };
    const getPerformanceDetail = vi.fn().mockResolvedValue(makeDetail("ID_1"));

    const getPerformanceDetailList = createGetPerformanceDetailList(
      makeDeps({ getPerformanceDetail, log }),
    );
    await getPerformanceDetailList(["ID_1", "ID_2", "ID_3"]);

    expect(log.info).toHaveBeenCalledWith(
      expect.stringContaining("3개의 공연 상세 텍스트 데이터 페칭 시작"),
    );
  });
});
