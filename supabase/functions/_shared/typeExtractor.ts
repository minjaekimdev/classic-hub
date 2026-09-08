// task_queue 테이블의 행 형태 (migrations의 task_queue 정의 기준)
export interface Queue {
  id: string;
  status: string; // PENDING | FAILED | COMPLETED | ARCHIVED
  payload: unknown; // { performanceId: string, storagePaths: string[] }
  error_message: string | null;
  retry_count: number;
  max_retries: number;
  next_retry_at: string | null;
}
