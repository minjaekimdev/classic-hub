import { DBPerformanceWrite } from "@classic-hub/shared/types/database";

export interface ProcessResult {
  id: string;
  error: string | null;
  data: DBPerformanceWrite | null;
}

export type WorkflowError = "ProcessError" | "BatchInsertError";
// processFailures, batchInsertFailures 둘 중 하나만 존재할 수 있으므로 옵셔널 프로퍼티 사용
export interface Artifact {
  processFailures?: ProcessResult[];
  batchInsertFailures?: DBPerformanceWrite[];
}
