import { ProcessResult } from "shared/types/sync";

// syncPerformanceData 한 번의 실행 결과 요약.
// Slack 요약 알림과 process.exitCode 판정이 모두 이 모양에 의존한다.
export interface SyncRunSummary {
  totalTargets: number;
  firstPassSuccesses: number;
  retryRecovered: number;
  finalFailures: ProcessResult[];
  // extract 단계의 상세 페칭 최종 실패 건수 (인라인 재시도·2차 패스로도 회복되지 않은 유실분)
  detailFetchFailures: number;
  insertAttempted: boolean;
  insertSucceeded: boolean;
}

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
    summary.detailFetchFailures > 0 ||
    !summary.insertSucceeded;

  const lines: string[] = [];
  lines.push(`${hasProblem ? "⚠️" : "✅"} 공연 동기화 완료`);
  lines.push(`- 대상 공연: ${summary.totalTargets}건`);
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
  lines.push(
    `- 최종 실패: ${summary.finalFailures.length}건${aggregation ? ` (${aggregation})` : ""}`,
  );

  if (summary.detailFetchFailures > 0) {
    lines.push(
      `- 상세 페칭 실패: ${summary.detailFetchFailures}건 (DetailFetchError artifact 확인 필요)`,
    );
  }

  if (!summary.insertAttempted) {
    lines.push("- DB 적재: 대상 없음 (성공 데이터 0건)");
  } else if (summary.insertSucceeded) {
    lines.push("- DB 적재: 성공");
  } else {
    lines.push("- DB 적재: ❌ 실패 (BatchInsertError artifact 확인 필요)");
  }

  if (artifactUrl) {
    lines.push(`🔗 실패 데이터 artifact: ${artifactUrl}`);
  }

  return lines.join("\n");
};
