import { ApiUsage, ProcessResult } from "shared/types/sync";

// syncPerformanceData 한 번의 실행 결과 요약.
// Slack 요약 알림과 process.exitCode 판정이 모두 이 모양에 의존한다.
export interface SyncRunSummary {
  totalTargets: number;
  // extract 단계의 분류 결과 — 신규(idsToInsert)·수정(idsToUpdate)·삭제 대상(idsToDelete) 건수.
  // 신규+수정은 중복 제거 전의 raw 개수라 totalTargets(중복 제거 후)과 합이 다를 수 있다.
  newCount: number;
  updateCount: number;
  deleteCount: number;
  firstPassSuccesses: number;
  retryRecovered: number;
  finalFailures: ProcessResult[];
  // extract 단계의 상세 페칭 최종 실패 id 목록 (인라인 재시도·2차 패스로도 회복되지 않은 유실분)
  detailFetchFailureIds: string[];
  insertAttempted: boolean;
  insertSucceeded: boolean;
  // 실행 동안 소비한 Vision/Gemini API 사용량
  apiUsage: ApiUsage;
}

// Slack 메시지 폭주 방지 — 실패 id는 최대 10개까지만 표시하고 나머지는 "외 N건"으로 요약한다.
// 전체 내역은 artifact가 담당한다 (요약 알림 철학과 일치).
const MAX_IDS_SHOWN = 10;

const formatIds = (ids: string[]): string => {
  const shown = ids.slice(0, MAX_IDS_SHOWN).join(", ");
  const overflow = ids.length - MAX_IDS_SHOWN;
  return overflow > 0 ? `${shown} 외 ${overflow}건` : shown;
};

// GitHub Actions 실행 환경에서만 존재하는 변수들로 artifact 페이지 URL을 만든다.
// 로컬 등 Actions 밖에서는 null (요약 메시지에서 링크 줄이 생략된다).
export const getRunArtifactUrl = (
  env: Record<string, string | undefined> = process.env,
): string | null => {
  const { GITHUB_SERVER_URL, GITHUB_REPOSITORY, GITHUB_RUN_ID } = env;
  if (!GITHUB_SERVER_URL || !GITHUB_REPOSITORY || !GITHUB_RUN_ID) {
    return null;
  }
  return `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}`;
};

// 실행당 딱 1건을 보내는 요약 메시지. 성공 시에도 보내서
// "메시지가 없다 = 크론이 아예 안 돌았다"를 구별할 수 있게 한다 (크론 스킵 감지).
export const buildSyncSummaryMessage = (
  summary: SyncRunSummary,
  artifactUrl: string | null = null,
): string => {
  const hasProblem =
    summary.finalFailures.length > 0 ||
    summary.detailFetchFailureIds.length > 0 ||
    !summary.insertSucceeded;

  const lines: string[] = [];
  lines.push(`${hasProblem ? "⚠️" : "✅"} 공연 동기화 완료`);
  lines.push(`- 대상 공연: ${summary.totalTargets}건`);
  lines.push(
    `- 신규: ${summary.newCount}건 / 수정: ${summary.updateCount}건 / 삭제: ${summary.deleteCount}건`,
  );
  lines.push(
    `- 1차 성공: ${summary.firstPassSuccesses}건 / 재시도 회복: ${summary.retryRecovered}건`,
  );

  const byError = summary.finalFailures.reduce<Record<string, number>>(
    (acc, failure) => {
      const type = failure.error ?? "Unknown";
      acc[type] = (acc[type] ?? 0) + 1;
      return acc;
    },
    {},
  );
  const aggregation = Object.entries(byError)
    .map(([type, count]) => `${type} ${count}건`)
    .join(", ");
  const failedIds = formatIds(summary.finalFailures.map((f) => f.id));
  lines.push(
    `- 최종 실패: ${summary.finalFailures.length}건${aggregation ? ` (${aggregation})` : ""}${failedIds ? ` — ID: ${failedIds}` : ""}`,
  );

  if (summary.detailFetchFailureIds.length > 0) {
    lines.push(
      `- 상세 페칭 실패: ${summary.detailFetchFailureIds.length}건 — ID: ${formatIds(summary.detailFetchFailureIds)} (DetailFetchError artifact 확인 필요)`,
    );
  }

  if (!summary.insertAttempted) {
    lines.push("- DB 적재: 대상 없음 (성공 데이터 0건)");
  } else if (summary.insertSucceeded) {
    lines.push("- DB 적재: 성공");
  } else {
    lines.push("- DB 적재: ❌ 실패 (BatchInsertError artifact 확인 필요)");
  }

  lines.push(
    `- API 사용량: Vision ${summary.apiUsage.visionRequests}건 / Gemini ${summary.apiUsage.geminiRequests}건 (입력 ${summary.apiUsage.geminiInputTokens.toLocaleString("en-US")} / 출력 ${summary.apiUsage.geminiOutputTokens.toLocaleString("en-US")} 토큰)`,
  );

  if (artifactUrl) {
    lines.push(`🔗 실패 데이터 artifact: ${artifactUrl}`);
  }

  return lines.join("\n");
};
