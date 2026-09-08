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

export type WorkflowError = "ProcessError" | "BatchInsertError";
// processFailures, batchInsertFailures 둘 중 하나만 존재할 수 있으므로 옵셔널 프로퍼티 사용
export interface Artifact {
  processFailures?: ProcessResult[];
  batchInsertFailures?: DBPerformanceWrite[];
}
