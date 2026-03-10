import { DBPerformanceWrite } from "@classic-hub/shared/types/database";

export interface ProcessResult {
  id: string;
  error: string | null;
  data: DBPerformanceWrite | null;
}
