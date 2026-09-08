import promiseLimiter from "@/shared/utils/promiseLimiter";
import { DBPerformanceWrite } from "@classic-hub/shared/types/database";
import { Artifact, ProcessResult } from "shared/types/sync";
import { PerformanceDetail } from "@/shared/types/kopis";

const REPROCESS_CONCURRENCY = 5;
const REFETCH_ERROR = "RefetchError";
const INSERT_ERROR = "BatchInsertError";

// 재처리가 의존하는 사이드 이펙트를 모두 주입받는다 (retry/syncPerformances의 deps 패턴과 동일).
export interface ReprocessFailuresDeps {
  fetchPerformanceDetail: (id: string) => Promise<PerformanceDetail>;
  processor: (detail: PerformanceDetail) => Promise<ProcessResult>;
  insertBulk: (payload: DBPerformanceWrite[]) => Promise<void>;
  log: {
    info: (msg: string) => void;
    error: (msg: string, error?: unknown) => void;
  };
}

export interface ReprocessOutcome {
  // batchInsert 실패분 + 재처리 회복분 중 이번 실행에서 DB에 적재된 행 수
  insertRecovered: number;
  insertFailed: number;
  // 재처리 후에도 실패한 항목 (재검토 대상)
  stillFailed: ProcessResult[];
}

// artifact(failed_records.json)의 실패 데이터를 재처리하는 정책 계층.
// - batchInsertFailures: 이미 완성된 데이터이므로 insert만 재수행
// - processFailures: 공연 ID로 KOPIS 재페칭 → 동일 처리 묶음 재실행
// insert는 upsert 기반이라 몇 번을 돌려도 같은 결과가 되는 멱등 작업이다.
export const createReprocessFailures = ({
  fetchPerformanceDetail,
  processor,
  insertBulk,
  log,
}: ReprocessFailuresDeps) => {
  return async (artifact: Artifact): Promise<ReprocessOutcome> => {
    const processFailures = artifact.processFailures ?? [];
    const batchInsertFailures = artifact.batchInsertFailures ?? [];

    if (processFailures.length === 0 && batchInsertFailures.length === 0) {
      log.info("[REPROCESS] 재처리할 실패 데이터가 없습니다.");
      return { insertRecovered: 0, insertFailed: 0, stillFailed: [] };
    }

    log.info(
      `[REPROCESS] 시작 — processFailures ${processFailures.length}건, batchInsertFailures ${batchInsertFailures.length}건`,
    );

    const reprocessed = await promiseLimiter(
      processFailures,
      async (failure): Promise<ProcessResult> => {
        try {
          const detail = await fetchPerformanceDetail(failure.id);
          return await processor(detail);
        } catch (error) {
          log.error(
            `[REPROCESS] ${failure.id} 재처리 실패 (사유: ${error})`,
          );
          return {
            id: failure.id,
            error: REFETCH_ERROR,
            data: null,
            attempts: (failure.attempts ?? 1) + 1,
            failedAt: new Date().toISOString(),
          };
        }
      },
      REPROCESS_CONCURRENCY,
    );

    const recovered = reprocessed.filter(
      (result): result is ProcessResult & { data: DBPerformanceWrite } =>
        result.data !== null,
    );
    const stillFailed = reprocessed.filter((result) => result.error !== null);

    // batchInsert 실패분(완성 데이터)과 재처리 회복분을 한 번에 적재한다
    const toInsert: DBPerformanceWrite[] = [
      ...batchInsertFailures,
      ...recovered.map((result) => result.data),
    ];

    let insertRecovered = 0;
    let insertFailed = 0;

    if (toInsert.length > 0) {
      try {
        await insertBulk(toInsert);
        insertRecovered = toInsert.length;
        log.info(
          `[REPROCESS] DB 재적재 성공 (${insertRecovered}건)`,
        );
      } catch (error) {
        insertFailed = toInsert.length;
        log.error("[REPROCESS] DB 재적재 실패", error);
        stillFailed.push(
          ...recovered.map((result) => ({ ...result, error: INSERT_ERROR })),
          ...batchInsertFailures.map((row) => ({
            id: String(row.performance_id),
            error: INSERT_ERROR,
            data: null,
          })),
        );
      }
    }

    return { insertRecovered, insertFailed, stillFailed };
  };
};
