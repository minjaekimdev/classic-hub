// 특정 공연 ID들을 지정해 수동으로 파이프라인을 돌리는 스크립트.
// - 입력: 커맨드라인 인자로 받은 KOPIS 공연 ID (픽스처 없이 KOPIS API를 직접 호출)
// - 처리: transform(이미지 페칭 + OCR + Gemini + 포스터 업로드) → DB upsert
// - 대상 DB: .env가 가리키는 DB (NODE_ENV=test로 실행하면 로컬, 미지정이면 프로덕션)
// - 사용법: npx tsx application/scripts/processById.ts PF302950 PF300129

import { PerformanceDetail } from "@/shared/types/kopis";
import logger from "@/shared/utils/logger";
import { kopisService } from "@/infrastructure/kopis/service";
import { transformPerformances } from "@/application/use-cases/2_transform";
import { callDatabaseFunction } from "@/infrastructure/supabase/database";

const usage = () => {
  logger.error("사용법: npx tsx application/scripts/processById.ts PF302950 PF300129 ...");
  process.exitCode = 1;
};

(async () => {
  const ids = process.argv.slice(2);
  if (ids.length === 0) {
    usage();
    return;
  }

  // 1. Extract — KOPIS API에서 상세 데이터를 직접 페칭
  const performances: PerformanceDetail[] = [];
  const extractFailures: { id: string; error: unknown }[] = [];
  for (const id of ids) {
    try {
      const detail = await kopisService.getPerformanceDetail(id);
      performances.push(detail);
      logger.info(`[EXTRACT] ${id} (${detail.prfnm}) 상세 조회 완료`);
    } catch (error) {
      extractFailures.push({ id, error });
      logger.error(`[EXTRACT_FAIL] ${id} 상세 조회 실패`, error);
    }
  }

  if (performances.length === 0) {
    logger.error("처리 가능한 공연이 없습니다. 종료합니다.");
    return;
  }

  // 2. Transform — 실제 구현체로 조립된 use-case 사용 (크론과 동일한 구성)
  const successes: Awaited<ReturnType<typeof transformPerformances>>["data"][] =
    [];
  const transformFailures: string[] = [];
  for (const performance of performances) {
    const result = await transformPerformances(performance);
    if (result.data) {
      successes.push(result.data);
      logger.info(`[TRANSFORM_OK] ${result.id}`);
    } else {
      transformFailures.push(`${result.id}: ${result.error}`);
      logger.error(`[TRANSFORM_FAIL] ${result.id}: ${result.error}`);
    }
  }

  if (successes.length === 0) {
    logger.error(`변환에 성공한 공연이 없습니다. 실패: ${transformFailures.join(", ")}`);
    return;
  }

  // 3. Load — 크론과 동일한 RPC로 upsert
  try {
    await callDatabaseFunction("upsert_performances_bulk", { payload: successes });
    logger.info(`[DB_SUCCESS] DB Upsert 성공 (${successes.length}건)`);
  } catch (error) {
    logger.error("[INSERT_FAIL] DB Upsert 실패", error);
    process.exitCode = 1;
    return;
  }

  const summary = {
    requested: ids.length,
    extractFailed: extractFailures.length,
    transformFailed: transformFailures.length,
    inserted: successes.length,
  };
  logger.info(`[DONE] 처리 완료: ${JSON.stringify(summary)}`);
  if (extractFailures.length > 0 || transformFailures.length > 0) {
    process.exitCode = 1;
  }
})();
