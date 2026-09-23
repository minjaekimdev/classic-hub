import { describe, it, expect, vi } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";
import {
  createSyncPerformanceData,
  SyncPerformancesDeps,
} from "./syncPerformances";
import { ProcessResult } from "shared/types/sync";
import { PerformanceDetail } from "@/shared/types/kopis";
import { saveFailuresToArtifact } from "@/infrastructure/github/saveFailuresToArtifact";

const makeDetail = (id: string): PerformanceDetail =>
  ({ mt20id: id }) as unknown as PerformanceDetail;

const successResult = (id: string): ProcessResult => ({
  id,
  error: null,
  data: { performance_id: id } as ProcessResult["data"],
});

const failResult = (id: string, error = "OCRError"): ProcessResult => ({
  id,
  error,
  data: null,
  attempts: 1,
  failedAt: "2026-01-01T00:00:00.000Z",
});

const makeDeps = (
  overrides: Partial<SyncPerformancesDeps> = {},
): SyncPerformancesDeps => ({
  extractPerformances: vi
    .fn()
    .mockResolvedValue({
      performances: [],
      idsToDelete: [],
      idsToInsert: [],
      idsToUpdate: [],
      detailFetchFailures: [],
    }),
  transformPerformances: vi.fn(),
  retry: vi.fn().mockResolvedValue({ retrySuccesses: [], retryFailures: [] }),
  insertPerformancesBulk: vi.fn().mockResolvedValue(undefined),
  deletePerformances: vi.fn().mockResolvedValue(undefined),
  notify: vi.fn().mockResolvedValue(undefined),
  saveFailuresToArtifact: vi.fn(),
  failedRecordsFilename: "failed_records.json",
  log: { info: vi.fn(), error: vi.fn() },
  ...overrides,
});

const run = (deps: SyncPerformancesDeps) =>
  createSyncPerformanceData(deps)(
    "20260101",
    "20261231",
    "20251130",
    "20261230",
    3,
  );

describe("syncPerformances 오케스트레이션 테스트", () => {
  it("모든 공연이 1차 패스에서 성공하면 재시도에 빈 배열을 넘기고, 알림·artifact 없이 bulk insert만 수행한다", async () => {
    const performances = [
      makeDetail("PF1"),
      makeDetail("PF2"),
      makeDetail("PF3"),
    ];
    const transformPerformances = vi
      .fn()
      .mockImplementation((p: PerformanceDetail) =>
        Promise.resolve(successResult(p.mt20id)),
      );

    const deps = makeDeps({
      extractPerformances: vi.fn().mockResolvedValue({
        performances,
        idsToDelete: [],
        idsToInsert: ["PF1", "PF2", "PF3"],
        idsToUpdate: [],
        detailFetchFailures: [],
      }),
      transformPerformances,
    });
    const summary = await run(deps);

    expect(deps.retry).toHaveBeenCalledWith(
      [],
      3,
      expect.objectContaining({ processor: expect.any(Function) }),
    );
    expect(deps.insertPerformancesBulk).toHaveBeenCalledTimes(1);
    expect(deps.insertPerformancesBulk).toHaveBeenCalledWith([
      { performance_id: "PF1" },
      { performance_id: "PF2" },
      { performance_id: "PF3" },
    ]);
    // 삭제 대상이 없으면 deletePerformances를 호출하지 않는다.
    expect(deps.deletePerformances).not.toHaveBeenCalled();
    expect(deps.saveFailuresToArtifact).not.toHaveBeenCalled();
    expect(deps.log.error).not.toHaveBeenCalled();

    expect(deps.notify).toHaveBeenCalledTimes(1);
    expect(deps.notify).toHaveBeenCalledWith(
      expect.stringContaining("✅ 공연 동기화 완료"),
    );
    expect(deps.notify).toHaveBeenCalledWith(
      expect.stringContaining("대상 공연: 3건"),
    );
    expect(deps.notify).toHaveBeenCalledWith(
      expect.stringContaining("신규: 3건 / 수정: 0건 / 삭제: 0건"),
    );
    expect(deps.notify).toHaveBeenCalledWith(
      expect.stringContaining("DB 삭제: 대상 없음"),
    );
    expect(deps.notify).toHaveBeenCalledWith(
      expect.stringContaining("DB 적재: 성공"),
    );

    expect(summary).toEqual({
      totalTargets: 3,
      newCount: 3,
      updateCount: 0,
      deleteCount: 0,
      firstPassSuccesses: 3,
      retryRecovered: 0,
      finalFailures: [],
      detailFetchFailureIds: [],
      insertAttempted: true,
      insertSucceeded: true,
      deleteAttempted: false,
      deleteSucceeded: false,
      apiUsage: {
        visionRequests: 0,
        geminiRequests: 0,
        geminiInputTokens: 0,
        geminiOutputTokens: 0,
      },
    });
  });

  it("일부 실패 시 실패 건(원본 입력 보존)만 재시도에 넘기고, 회복된 데이터(1차 패스에서 실패했지만 재시도에서 성공한 항목)를 bulk insert에 합친다", async () => {
    const performances = [
      makeDetail("PF1"),
      makeDetail("PF2"),
      makeDetail("PF3"),
    ];
    const transformPerformances = vi
      .fn()
      .mockImplementation((p: PerformanceDetail) =>
        p.mt20id === "PF2"
          ? Promise.resolve(failResult("PF2", "GeminiError"))
          : Promise.resolve(successResult(p.mt20id)),
      );
    const retry = vi.fn().mockResolvedValue({
      retrySuccesses: [successResult("PF2")],
      retryFailures: [],
    });

    const deps = makeDeps({
      extractPerformances: vi.fn().mockResolvedValue({
        performances,
        idsToDelete: [],
        idsToInsert: ["PF1", "PF3"],
        idsToUpdate: ["PF2"],
        detailFetchFailures: [],
      }),
      transformPerformances,
      retry,
    });
    const summary = await run(deps);

    expect(retry).toHaveBeenCalledTimes(1);
    const [failures, maxRepeat, retryDeps] = retry.mock.calls[0];
    expect(maxRepeat).toBe(3);
    expect(failures).toHaveLength(1);
    expect(failures[0].input).toBe(performances[1]);
    expect(failures[0].result.error).toBe("GeminiError");
    // processor는 실행 단위 usage를 주입한 래퍼이므로, 호출 시 usage 객체가 함께 전달되는지로 검증한다.
    expect(typeof retryDeps.processor).toBe("function");
    await retryDeps.processor(performances[1]);
    expect(transformPerformances).toHaveBeenCalledWith(
      performances[1],
      expect.objectContaining({ visionRequests: 0, geminiRequests: 0 }),
    );
    expect(typeof retryDeps.sleep).toBe("function");

    expect(deps.insertPerformancesBulk).toHaveBeenCalledTimes(1);
    expect(deps.insertPerformancesBulk).toHaveBeenCalledWith([
      { performance_id: "PF1" },
      { performance_id: "PF3" },
      { performance_id: "PF2" },
    ]);
    expect(deps.saveFailuresToArtifact).not.toHaveBeenCalled();

    expect(deps.notify).toHaveBeenCalledTimes(1);
    expect(deps.notify).toHaveBeenCalledWith(
      expect.stringContaining("재시도 회복: 1건"),
    );
    expect(deps.notify).toHaveBeenCalledWith(
      expect.stringContaining("신규: 2건 / 수정: 1건 / 삭제: 0건"),
    );

    expect(summary).toEqual({
      totalTargets: 3,
      newCount: 2,
      updateCount: 1,
      deleteCount: 0,
      firstPassSuccesses: 2,
      retryRecovered: 1,
      finalFailures: [],
      detailFetchFailureIds: [],
      insertAttempted: true,
      insertSucceeded: true,
      deleteAttempted: false,
      deleteSucceeded: false,
      apiUsage: {
        visionRequests: 0,
        geminiRequests: 0,
        geminiInputTokens: 0,
        geminiOutputTokens: 0,
      },
    });
  });

  it("재시도 후에도 모두 실패하면 artifact(ProcessError)에 저장하고 요약 알림을 보내며, 성공 데이터가 없어 insert는 수행하지 않는다", async () => {
    const performances = [makeDetail("PF1"), makeDetail("PF2")];
    const transformPerformances = vi
      .fn()
      .mockImplementation((p: PerformanceDetail) =>
        Promise.resolve(failResult(p.mt20id, p.mt20id === "PF1" ? "GeminiError" : "OCRError")),
      );
    const retryFailures = [
      failResult("PF1", "GeminiError"),
      failResult("PF2", "OCRError"),
    ];
    const retry = vi.fn().mockResolvedValue({
      retrySuccesses: [],
      retryFailures,
    });
    const saveFailuresToArtifact = vi.fn();
    const notify = vi.fn().mockResolvedValue(undefined);

    const deps = makeDeps({
      extractPerformances: vi.fn().mockResolvedValue({
        performances,
        idsToDelete: [],
        idsToInsert: ["PF1", "PF2"],
        idsToUpdate: [],
        detailFetchFailures: [],
      }),
      transformPerformances,
      retry,
      saveFailuresToArtifact,
      notify,
    });
    const summary = await run(deps);

    expect(saveFailuresToArtifact).toHaveBeenCalledWith(
      "failed_records.json",
      retryFailures,
      "ProcessError",
    );
    expect(notify).toHaveBeenCalledTimes(1);
    expect(notify).toHaveBeenCalledWith(
      expect.stringContaining("최종 실패: 2건 (GeminiError 1건, OCRError 1건)"),
    );
    expect(deps.insertPerformancesBulk).not.toHaveBeenCalled();

    expect(summary.finalFailures).toHaveLength(2);
    expect(summary.insertAttempted).toBe(false);
    expect(summary.insertSucceeded).toBe(false);

    // Slack 실패로 데이터가 유실되지 않도록 artifact를 알림보다 먼저 저장한다
    const artifactOrder = saveFailuresToArtifact.mock.invocationCallOrder[0];
    const notifyOrder = notify.mock.invocationCallOrder[0];
    expect(artifactOrder).toBeLessThan(notifyOrder);
  });

  it("bulk insert가 실패하면 성공 데이터를 artifact(BatchInsertError)에 저장하고 알림을 보내며, 에러를 상위로 던지지 않는다", async () => {
    const performances = [makeDetail("PF1"), makeDetail("PF2")];
    const transformPerformances = vi
      .fn()
      .mockImplementation((p: PerformanceDetail) =>
        Promise.resolve(successResult(p.mt20id)),
      );

    const deps = makeDeps({
      extractPerformances: vi.fn().mockResolvedValue({
        performances,
        idsToDelete: [],
        idsToInsert: ["PF1", "PF2"],
        idsToUpdate: [],
        detailFetchFailures: [],
      }),
      transformPerformances,
      insertPerformancesBulk: vi
        .fn()
        .mockRejectedValue(new Error("RPC Failed")),
    });
    const summary = await run(deps);

    expect(deps.saveFailuresToArtifact).toHaveBeenCalledWith(
      "failed_records.json",
      [
        expect.objectContaining({ performance_id: "PF1" }),
        expect.objectContaining({ performance_id: "PF2" }),
      ],
      "BatchInsertError",
    );
    expect(deps.notify).toHaveBeenCalledTimes(1);
    expect(deps.notify).toHaveBeenCalledWith(
      expect.stringContaining("DB 적재: ❌ 실패"),
    );

    expect(summary!.insertSucceeded).toBe(false);
    expect(summary!.insertAttempted).toBe(true);
    expect(summary!.firstPassSuccesses).toBe(2);
  });

  it("extract 단계가 실패하면 에러를 상위로 전파하고 이후 단계를 수행하지 않는다", async () => {
    const deps = makeDeps({
      extractPerformances: vi.fn().mockRejectedValue(new Error("KOPIS 실패")),
    });
    await expect(run(deps)).rejects.toThrow("KOPIS 실패");

    expect(deps.transformPerformances).not.toHaveBeenCalled();
    expect(deps.retry).not.toHaveBeenCalled();
    expect(deps.insertPerformancesBulk).not.toHaveBeenCalled();
  });

  it("재시도 소진 실패 시 진짜 artifact writer가 임시 파일에 processFailures를 기록한다", async () => {
    const performances = [makeDetail("PF2")];
    const transformPerformances = vi
      .fn()
      .mockImplementation((p: PerformanceDetail) =>
        Promise.resolve(failResult(p.mt20id, "GeminiError")),
      );
    const retry = vi.fn().mockResolvedValue({
      retrySuccesses: [],
      retryFailures: [failResult("PF2", "GeminiError")],
    });

    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "artifact-real-"));
    const artifactPath = path.join(dir, "failed_records.json");

    const deps = makeDeps({
      extractPerformances: vi.fn().mockResolvedValue({
        performances,
        idsToDelete: [],
        idsToInsert: ["PF2"],
        idsToUpdate: [],
        detailFetchFailures: [],
      }),
      transformPerformances,
      retry,
      saveFailuresToArtifact,
      failedRecordsFilename: artifactPath,
    });

    try {
      await run(deps);

      const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));

      expect(artifact.processFailures).toHaveLength(1);
      expect(artifact.processFailures[0]).toMatchObject({
        id: "PF2",
        error: "GeminiError",
        attempts: 1,
      });
      expect(artifact.processFailures[0].failedAt).toBeTruthy();
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it("extract의 상세 페칭 실패는 artifact(DetailFetchError)에 기록되고 요약 알림에 포함된다", async () => {
    const performances = [makeDetail("PF1")];
    const detailFetchFailures = [
      {
        id: "PF_MISSING",
        error: "DetailFetchError",
        failedAt: "2026-01-01T00:00:00.000Z",
      },
    ];
    const transformPerformances = vi
      .fn()
      .mockImplementation((p: PerformanceDetail) =>
        Promise.resolve(successResult(p.mt20id)),
      );

    const deps = makeDeps({
      extractPerformances: vi.fn().mockResolvedValue({
        performances,
        idsToDelete: [],
        idsToInsert: ["PF1"],
        idsToUpdate: [],
        detailFetchFailures,
      }),
      transformPerformances,
    });
    const summary = await run(deps);

    expect(deps.saveFailuresToArtifact).toHaveBeenCalledWith(
      "failed_records.json",
      detailFetchFailures,
      "DetailFetchError",
    );
    expect(deps.log.error).toHaveBeenCalledWith(
      expect.stringContaining("상세 페칭 최종 실패 1건"),
    );
    expect(deps.notify).toHaveBeenCalledWith(
      expect.stringContaining("상세 페칭 실패: 1건"),
    );
    expect(deps.notify).toHaveBeenCalledWith(
      expect.stringContaining("상세 페칭 실패: 1건 — ID: PF_MISSING"),
    );
    expect(summary.detailFetchFailureIds).toEqual(["PF_MISSING"]);
    // 대상 공연은 transform에 투입된 performances와 유실분을 모두 포함한다.
    expect(summary.totalTargets).toBe(2);
  });

  it("idsToDelete가 있으면 insert 후 삭제를 수행하고 요약에 성공을 표시한다", async () => {
    const performances = [makeDetail("PF1")];
    const insertPerformancesBulk = vi.fn().mockResolvedValue(undefined);
    const deletePerformances = vi.fn().mockResolvedValue(undefined);
    const deps = makeDeps({
      extractPerformances: vi.fn().mockResolvedValue({
        performances,
        idsToDelete: ["PF_OLD"],
        idsToInsert: ["PF1"],
        idsToUpdate: [],
        detailFetchFailures: [],
      }),
      transformPerformances: vi
        .fn()
        .mockImplementation((p: PerformanceDetail) =>
          Promise.resolve(successResult(p.mt20id)),
        ),
      insertPerformancesBulk,
      deletePerformances,
    });
    const summary = await run(deps);

    expect(deletePerformances).toHaveBeenCalledTimes(1);
    expect(deletePerformances).toHaveBeenCalledWith(["PF_OLD"]);

    // 삭제는 insert보다 뒤에 실행된다 (파괴적 연산은 마지막에).
    const insertOrder = insertPerformancesBulk.mock.invocationCallOrder[0];
    const deleteOrder = deletePerformances.mock.invocationCallOrder[0];
    expect(deleteOrder).toBeGreaterThan(insertOrder);

    expect(deps.notify).toHaveBeenCalledWith(
      expect.stringContaining("DB 삭제: 성공"),
    );
    expect(summary.deleteAttempted).toBe(true);
    expect(summary.deleteSucceeded).toBe(true);
  });

  it("삭제가 실패하면 artifact(DeleteError)에 기록하고 요약에 실패를 표시하며 알림은 계속 보낸다", async () => {
    const performances = [makeDetail("PF1")];
    const notify = vi.fn().mockResolvedValue(undefined);
    const saveFailuresToArtifact = vi.fn();
    const deletePerformances = vi.fn().mockRejectedValue(new Error("FK violation"));
    const deps = makeDeps({
      extractPerformances: vi.fn().mockResolvedValue({
        performances,
        idsToDelete: ["PF_OLD"],
        idsToInsert: ["PF1"],
        idsToUpdate: [],
        detailFetchFailures: [],
      }),
      transformPerformances: vi
        .fn()
        .mockImplementation((p: PerformanceDetail) =>
          Promise.resolve(successResult(p.mt20id)),
        ),
      deletePerformances,
      saveFailuresToArtifact,
      notify,
    });
    const summary = await run(deps);

    expect(saveFailuresToArtifact).toHaveBeenCalledWith(
      "failed_records.json",
      [
        expect.objectContaining({
          id: "PF_OLD",
          error: "DeleteError",
          failedAt: expect.any(String),
        }),
      ],
      "DeleteError",
    );

    // 삭제 실패가 알림 자체를 막지 않는다 (조용한 실패 방지).
    expect(notify).toHaveBeenCalledTimes(1);
    expect(notify).toHaveBeenCalledWith(
      expect.stringContaining("DB 삭제: ❌ 실패"),
    );

    // Slack 알림보다 artifact 저장이 먼저다 (insert 실패 케이스와 동일한 원칙).
    const artifactOrder = saveFailuresToArtifact.mock.invocationCallOrder[0];
    const notifyOrder = notify.mock.invocationCallOrder[0];
    expect(artifactOrder).toBeLessThan(notifyOrder);

    expect(summary.deleteAttempted).toBe(true);
    expect(summary.deleteSucceeded).toBe(false);
    // 삭제 실패와 무관하게 insert는 정상 완료된다.
    expect(summary.insertSucceeded).toBe(true);
  });
});
