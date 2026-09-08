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
  // 백오프·쿨다운 대기는 즉시 반환 (백오프 시퀀스를 단언 가능한 명세로 만든다)
  sleep: vi.fn().mockResolvedValue(undefined),
  log: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
  ...overrides,
});

// 헬퍼: 최소한의 PerformanceDetail 스텁 생성
const makeDetail = (id: string): PerformanceDetail =>
  ({ mt20id: id } as unknown as PerformanceDetail);

describe("getPerformanceDetailList 비즈니스 로직 테스트", () => {
  it("모든 id에 대해 getPerformanceDetail을 호출하여 performances와 빈 failures를 반환해야 한다", async () => {
    const getPerformanceDetail = vi
      .fn()
      .mockResolvedValueOnce(makeDetail("ID_1"))
      .mockResolvedValueOnce(makeDetail("ID_2"));

    const getPerformanceDetailList = createGetPerformanceDetailList(
      makeDeps({ getPerformanceDetail }),
    );
    const result = await getPerformanceDetailList(["ID_1", "ID_2"]);

    expect(result.performances).toEqual([makeDetail("ID_1"), makeDetail("ID_2")]);
    expect(result.failures).toEqual([]);
    expect(getPerformanceDetail).toHaveBeenCalledTimes(2);
  });

  it("일시 실패는 인라인 재시도(2초 백오프 후)로 회복하고 sleep을 통해 대기한다", async () => {
    const getPerformanceDetail = vi
      .fn()
      .mockResolvedValueOnce(makeDetail("ID_1"))
      .mockRejectedValueOnce(new Error("429 Too Many Requests"))
      .mockResolvedValue(makeDetail("ID_2"));
    const sleep = vi.fn().mockResolvedValue(undefined);

    const getPerformanceDetailList = createGetPerformanceDetailList(
      makeDeps({ getPerformanceDetail, sleep }),
    );
    const result = await getPerformanceDetailList(["ID_1", "ID_2"]);

    expect(result.performances).toEqual([makeDetail("ID_1"), makeDetail("ID_2")]);
    expect(result.failures).toEqual([]);
    expect(sleep).toHaveBeenCalledWith(2000);
  });

  it("3회 시도 후에도 실패하면 failures에 기록하고 나머지 id는 계속 진행하며, 2차 패스에서도 실패하면 최종 유실된다", async () => {
    // ID_1은 항상 실패(1차 3회 + 2차 3회), ID_3은 항상 성공
    const getPerformanceDetail = vi.fn((id: string) =>
      id === "ID_1" ? Promise.reject(new Error("500")) : Promise.resolve(makeDetail(id)),
    );
    const sleep = vi.fn().mockResolvedValue(undefined);

    const getPerformanceDetailList = createGetPerformanceDetailList(
      makeDeps({ getPerformanceDetail, sleep }),
    );
    const result = await getPerformanceDetailList(["ID_1", "ID_3"]);

    expect(result.performances).toEqual([makeDetail("ID_3")]);
    expect(result.failures).toHaveLength(1);
    expect(result.failures[0].id).toBe("ID_1");
    expect(result.failures[0].error).toBe("DetailFetchError");
    expect(result.failures[0].failedAt).toBeTruthy();
    // ID_1: 1차 패스 백오프 2회 + 2차 패스 백오프 2회 + 패스 간 쿨다운 1회
    expect(sleep).toHaveBeenNthCalledWith(1, 2000);
    expect(sleep).toHaveBeenNthCalledWith(2, 4000);
    expect(sleep).toHaveBeenNthCalledWith(3, 30000);
    expect(sleep).toHaveBeenNthCalledWith(4, 2000);
    expect(sleep).toHaveBeenNthCalledWith(5, 4000);
    expect(getPerformanceDetail).toHaveBeenCalledTimes(7); // ID_1 6회 + ID_3 1회 (2차 패스는 실패분만 재시도)
  });

  it("1차 패스 실패분은 30초 쿨다운 후 2차 패스로 재시도되어 회복될 수 있다", async () => {
    // ID_1: 1차 패스 3회 모두 실패 → 2차 패스에서 성공
    const getPerformanceDetail = vi
      .fn()
      .mockRejectedValueOnce(new Error("500"))
      .mockRejectedValueOnce(new Error("500"))
      .mockRejectedValueOnce(new Error("500"))
      .mockResolvedValue(makeDetail("ID_1"));
    const sleep = vi.fn().mockResolvedValue(undefined);

    const getPerformanceDetailList = createGetPerformanceDetailList(
      makeDeps({ getPerformanceDetail, sleep }),
    );
    const result = await getPerformanceDetailList(["ID_1"]);

    expect(result.performances).toEqual([makeDetail("ID_1")]);
    expect(result.failures).toEqual([]);
    expect(sleep).toHaveBeenCalledWith(30000);
  });

  it("2차 패스에서도 실패하면 최종 failures로 반환한다", async () => {
    const getPerformanceDetail = vi
      .fn()
      .mockRejectedValue(new Error("500"));
    const sleep = vi.fn().mockResolvedValue(undefined);

    const getPerformanceDetailList = createGetPerformanceDetailList(
      makeDeps({ getPerformanceDetail, sleep }),
    );
    const result = await getPerformanceDetailList(["ID_1"]);

    // 1차 패스 3회 + 2차 패스 3회 = 6회 시도
    expect(getPerformanceDetail).toHaveBeenCalledTimes(6);
    expect(result.performances).toEqual([]);
    expect(result.failures).toHaveLength(1);
    expect(result.failures[0].id).toBe("ID_1");
    // 백오프(2분... 초 단위: 2000, 4000) × 2패스 + 쿨다운 30000 순서
    expect(sleep).toHaveBeenNthCalledWith(1, 2000);
    expect(sleep).toHaveBeenNthCalledWith(2, 4000);
    expect(sleep).toHaveBeenNthCalledWith(3, 30000);
    expect(sleep).toHaveBeenNthCalledWith(4, 2000);
    expect(sleep).toHaveBeenNthCalledWith(5, 4000);
  });

  it("빈 배열이 들어오면 빈 결과를 반환하고 getPerformanceDetail은 호출되지 않아야 한다", async () => {
    const getPerformanceDetail = vi.fn();

    const getPerformanceDetailList = createGetPerformanceDetailList(
      makeDeps({ getPerformanceDetail }),
    );
    const result = await getPerformanceDetailList([]);

    expect(result).toEqual({ performances: [], failures: [] });
    expect(getPerformanceDetail).not.toHaveBeenCalled();
  });

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

  it("시작 시점에 id 개수를 포함한 info 로그를 남겨야 한다", async () => {
    const log = { info: vi.fn(), warn: vi.fn(), error: vi.fn() };
    const getPerformanceDetail = vi.fn().mockResolvedValue(makeDetail("ID_1"));

    const getPerformanceDetailList = createGetPerformanceDetailList(
      makeDeps({ getPerformanceDetail, log }),
    );
    await getPerformanceDetailList(["ID_1", "ID_2", "ID_3"]);

    expect(log.info).toHaveBeenCalledWith(
      expect.stringContaining("3개의 공연 상세 텍스트 데이터 페칭 시작"),
    );
  });

  it("각 id 페칭 전에 현재/전체 진행률과 검색 키(ID)를 로그로 남긴다", async () => {
    const log = { info: vi.fn(), warn: vi.fn(), error: vi.fn() };
    const getPerformanceDetail = vi.fn().mockResolvedValue(makeDetail("ID_1"));

    const getPerformanceDetailList = createGetPerformanceDetailList(
      makeDeps({ getPerformanceDetail, log }),
    );
    await getPerformanceDetailList(["ID_1", "ID_2"]);

    expect(log.info).toHaveBeenCalledWith(
      expect.stringContaining("(1/2) ID: ID_1"),
    );
    expect(log.info).toHaveBeenCalledWith(
      expect.stringContaining("(2/2) ID: ID_2"),
    );
  });
});
