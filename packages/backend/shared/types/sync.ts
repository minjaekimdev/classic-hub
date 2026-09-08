import { DBPerformanceWrite } from "@classic-hub/shared/types/database";

export interface ProcessResult {
  id: string;
  error: string | null;
  data: DBPerformanceWrite | null;
  // 실패 기록 전용 필드 (성공 결과에는 없음)
  // failedAt: 마지막으로 실패한 시각 (ISO 8601), attempts: 첫 시도를 포함한 누적 시도 횟수
  failedAt?: string;
  attempts?: number;
}

export type WorkflowError = "ProcessError" | "BatchInsertError" | "DetailFetchError";

// extract 단계의 상세 페칭 실패 기록 — 상세 데이터 자체가 없으므로 id/사유/시각만 남긴다.
export interface DetailFetchFailure {
  id: string;
  error: string;
  failedAt: string;
}

// processFailures, batchInsertFailures, detailFetchFailures는 배타적이지 않을 수 있으므로 옵셔널 프로퍼티 사용
export interface Artifact {
  processFailures?: ProcessResult[];
  batchInsertFailures?: DBPerformanceWrite[];
  detailFetchFailures?: DetailFetchFailure[];
}
