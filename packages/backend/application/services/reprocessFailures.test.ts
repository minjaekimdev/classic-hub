import { describe, it, expect, vi } from "vitest";
import {
  createReprocessFailures,
  ReprocessFailuresDeps,
} from "./reprocessFailures";
import { Artifact, ProcessResult } from "shared/types/sync";
import { PerformanceDetail } from "@/shared/types/kopis";

const failRecord = (id: string, error = "GeminiError"): ProcessResult => ({
  id,
  error,
  data: null,
  attempts: 6,
  failedAt: "2026-09-05T00:00:00.000Z",
});

const successResult = (id: string): ProcessResult => ({
  id,
  error: null,
  data: { performance_id: id } as ProcessResult["data"],
});

const makeDetail = (id: string) => ({ mt20id: id }) as unknown as PerformanceDetail;

const makeDeps = (
  overrides: Partial<ReprocessFailuresDeps> = {},
): ReprocessFailuresDeps => ({
  fetchPerformanceDetail: vi
    .fn()
    .mockImplementation((id: string) => Promise.resolve(makeDetail(id))),
  processor: vi
    .fn()
    .mockImplementation((detail: PerformanceDetail) =>
      Promise.resolve(successResult(detail.mt20id)),
    ),
  insertBulk: vi.fn().mockResolvedValue(undefined),
  log: { info: vi.fn(), error: vi.fn() },
  ...overrides,
});

describe("reprocessFailures 비즈니스 로직 테스트", () => {
  it("빈 artifact면 아무 작업 없이 종료한다", async () => {
    const deps = makeDeps();

    const outcome = await createReprocessFailures(deps)({});

    expect(deps.insertBulk).not.toHaveBeenCalled();
    expect(deps.fetchPerformanceDetail).not.toHaveBeenCalled();
    expect(outcome).toEqual({
      insertRecovered: 0,
      insertFailed: 0,
      stillFailed: [],
    });
  });

  it("batchInsert 실패분은 재페칭 없이 바로 재적재한다", async () => {
    const deps = makeDeps();

    const outcome = await createReprocessFailures(deps)({
      batchInsertFailures: [
        { performance_id: "PF1" },
        { performance_id: "PF2" },
      ] as Artifact["batchInsertFailures"],
    });

    expect(deps.insertBulk).toHaveBeenCalledTimes(1);
    expect(deps.insertBulk).toHaveBeenCalledWith([
      { performance_id: "PF1" },
      { performance_id: "PF2" },
    ]);
    expect(deps.fetchPerformanceDetail).not.toHaveBeenCalled();
    expect(outcome.insertRecovered).toBe(2);
    expect(outcome.stillFailed).toHaveLength(0);
  });

  it("processFailures는 ID로 재페칭해 동일 처리 묶음을 재실행하고, 회복분을 적재한다", async () => {
    const deps = makeDeps();

    const outcome = await createReprocessFailures(deps)({
      processFailures: [failRecord("PF1"), failRecord("PF2")],
    });

    expect(deps.fetchPerformanceDetail).toHaveBeenCalledWith("PF1");
    expect(deps.fetchPerformanceDetail).toHaveBeenCalledWith("PF2");
    expect(deps.insertBulk).toHaveBeenCalledTimes(1);
    expect(deps.insertBulk).toHaveBeenCalledWith([
      { performance_id: "PF1" },
      { performance_id: "PF2" },
    ]);
    expect(outcome.insertRecovered).toBe(2);
    expect(outcome.stillFailed).toHaveLength(0);
  });

  it("재처리에도 실패한 항목은 적재에서 제외되고 stillFailed로 분류된다", async () => {
    const processor = vi
      .fn()
      .mockImplementation((detail: PerformanceDetail) =>
        detail.mt20id === "PF2"
          ? Promise.resolve(failRecord("PF2", "GeminiError"))
          : Promise.resolve(successResult(detail.mt20id)),
      );
    const deps = makeDeps({ processor });

    const outcome = await createReprocessFailures(deps)({
      processFailures: [failRecord("PF1"), failRecord("PF2")],
    });

    expect(deps.insertBulk).toHaveBeenCalledWith([
      { performance_id: "PF1" },
    ]);
    expect(outcome.insertRecovered).toBe(1);
    expect(outcome.stillFailed).toHaveLength(1);
    expect(outcome.stillFailed[0]!.id).toBe("PF2");
    expect(outcome.stillFailed[0]!.error).toBe("GeminiError");
  });

  it("재페칭 자체가 실패하면 RefetchError로 분류하고 attempts를 증가시킨다", async () => {
    const deps = makeDeps({
      fetchPerformanceDetail: vi
        .fn()
        .mockRejectedValue(new Error("KOPIS down")),
    });

    const outcome = await createReprocessFailures(deps)({
      processFailures: [failRecord("PF1")],
    });

    expect(outcome.insertRecovered).toBe(0);
    expect(outcome.stillFailed).toHaveLength(1);
    expect(outcome.stillFailed[0]!.error).toBe("RefetchError");
    expect(outcome.stillFailed[0]!.attempts).toBe(7);
    expect(deps.insertBulk).not.toHaveBeenCalled();
  });

  it("최종 재적재가 실패하면 회복분 전체를 BatchInsertError로 분류한다", async () => {
    const deps = makeDeps({
      insertBulk: vi.fn().mockRejectedValue(new Error("RPC Failed")),
    });

    const outcome = await createReprocessFailures(deps)({
      processFailures: [failRecord("PF1")],
      batchInsertFailures: [{ performance_id: "PF9" }] as Artifact["batchInsertFailures"],
    });

    expect(outcome.insertRecovered).toBe(0);
    expect(outcome.insertFailed).toBe(2);
    expect(outcome.stillFailed).toHaveLength(2);
    expect(outcome.stillFailed.every((f) => f.error === "BatchInsertError")).toBe(
      true,
    );
  });
});
