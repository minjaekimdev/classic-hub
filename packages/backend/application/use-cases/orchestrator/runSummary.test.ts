import { describe, it, expect } from "vitest";
import {
  buildSyncSummaryMessage,
  getRunArtifactUrl,
  SyncRunSummary,
} from "./runSummary";
import { ProcessResult } from "shared/types/sync";

const failResult = (id: string, error: string): ProcessResult => ({
  id,
  error,
  data: null,
});

const makeSummary = (
  overrides: Partial<SyncRunSummary> = {},
): SyncRunSummary => ({
  totalTargets: 45,
  newCount: 30,
  updateCount: 12,
  deleteCount: 3,
  firstPassSuccesses: 42,
  retryRecovered: 2,
  finalFailures: [],
  detailFetchFailureIds: [],
  insertAttempted: true,
  insertSucceeded: true,
  apiUsage: {
    visionRequests: 0,
    geminiRequests: 0,
    geminiInputTokens: 0,
    geminiOutputTokens: 0,
  },
  ...overrides,
});

describe("buildSyncSummaryMessage 테스트", () => {
  it("전부 성공하면 ✅ 상태와 성공 요약을 만든다", () => {
    const message = buildSyncSummaryMessage(makeSummary());

    expect(message).toContain("✅ 공연 동기화 완료");
    expect(message).toContain("대상 공연: 45건");
    expect(message).toContain("신규: 30건 / 수정: 12건 / 삭제: 3건");
    expect(message).toContain("1차 성공: 42건 / 재시도 회복: 2건");
    expect(message).toContain("최종 실패: 0건");
    expect(message).toContain("DB 적재: 성공");
  });

  it("최종 실패가 있으면 유형별 집계와 함께 ⚠️ 상태를 만든다", () => {
    const message = buildSyncSummaryMessage(
      makeSummary({
        finalFailures: [
          failResult("PF1", "GeminiError"),
          failResult("PF2", "GeminiError"),
          failResult("PF3", "OCRError"),
        ],
        insertSucceeded: true,
      }),
    );

    expect(message).toContain("⚠️ 공연 동기화 완료");
    expect(message).toContain(
      "최종 실패: 3건 (GeminiError 2건, OCRError 1건) — ID: PF1, PF2, PF3",
    );
  });

  it("insert가 실패하면 ❌ DB 적재 상태를 만든다", () => {
    const message = buildSyncSummaryMessage(makeSummary({ insertSucceeded: false }));

    expect(message).toContain("DB 적재: ❌ 실패");
    expect(message).toContain("⚠️ 공연 동기화 완료");
  });

  it("상세 페칭 실패가 있으면 ⚠️ 상태와 함께 건수·id를 표시한다", () => {
    const message = buildSyncSummaryMessage(
      makeSummary({ detailFetchFailureIds: ["PF_MISSING"] }),
    );

    expect(message).toContain("⚠️ 공연 동기화 완료");
    expect(message).toContain(
      "상세 페칭 실패: 1건 — ID: PF_MISSING (DetailFetchError artifact 확인 필요)",
    );
  });

  it("실패 id가 10개를 넘으면 10개만 표시하고 나머지는 '외 N건'으로 요약한다", () => {
    const ids = Array.from({ length: 12 }, (_, i) => `PF${i + 1}`);
    const message = buildSyncSummaryMessage(
      makeSummary({
        finalFailures: ids.map((id) => failResult(id, "GeminiError")),
      }),
    );

    expect(message).toContain("최종 실패: 12건 (GeminiError 12건)");
    expect(message).toContain(
      "— ID: PF1, PF2, PF3, PF4, PF5, PF6, PF7, PF8, PF9, PF10 외 2건",
    );
  });

  it("성공 데이터가 0건이면 insert를 시도하지 않았음을 표시한다", () => {
    const message = buildSyncSummaryMessage(
      makeSummary({ insertAttempted: false, insertSucceeded: false }),
    );

    expect(message).toContain("DB 적재: 대상 없음");
  });

  it("API 사용량을 표시한다", () => {
    const message = buildSyncSummaryMessage(
      makeSummary({
        apiUsage: {
          visionRequests: 47,
          geminiRequests: 42,
          geminiInputTokens: 1234567,
          geminiOutputTokens: 890123,
        },
      }),
    );

    expect(message).toContain(
      "API 사용량: Vision 47건 / Gemini 42건 (입력 1,234,567 / 출력 890,123 토큰)",
    );
  });

  it("artifact 링크가 있으면 포함하고, 없으면 생략한다", () => {
    const withLink = buildSyncSummaryMessage(makeSummary(), "https://github.com/o/r/actions/runs/1");
    const withoutLink = buildSyncSummaryMessage(makeSummary());

    expect(withLink).toContain(
      "🔗 실패 데이터 artifact: https://github.com/o/r/actions/runs/1",
    );
    expect(withoutLink).not.toContain("artifact");
  });
});

describe("getRunArtifactUrl 테스트", () => {
  it("Actions 환경변수가 모두 있으면 실행 페이지 URL을 만든다", () => {
    expect(
      getRunArtifactUrl({
        GITHUB_SERVER_URL: "https://github.com",
        GITHUB_REPOSITORY: "o/r",
        GITHUB_RUN_ID: "123",
      }),
    ).toBe("https://github.com/o/r/actions/runs/123");
  });

  it("하나라도 없으면 null을 반환한다", () => {
    expect(
      getRunArtifactUrl({ GITHUB_SERVER_URL: "https://github.com" }),
    ).toBeNull();
    expect(getRunArtifactUrl({})).toBeNull();
  });
});
