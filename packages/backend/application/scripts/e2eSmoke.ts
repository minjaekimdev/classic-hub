// 픽스처 공연 1건으로 전체 파이프라인을 수동 검증하는 e2e 스모크 스크립트.
// - 입력: fixtures/kopis/{ID}.json (결정적 입력 — KOPIS API는 호출하지 않는다)
// - 의존성: 이미지 CDN, Vision OCR, Gemini, Storage, 로컬 Supabase DB = 전부 실제 구현체
// - 사전 조건: 로컬 Supabase 기동(npx supabase start && npx supabase db reset),
//              .env.test가 로컬을 가리킬 것(갱신은 scripts/sync-env.js), .env에 GEMINI_API_KEY
// - 사용법: npm run test-smoke [-- PF286762]

import fs from "fs";
import path from "path";
import logger from "@/shared/utils/logger";
import { createSyncPerformanceData } from "@/application/use-cases/orchestrator/syncPerformances";
import { retry } from "@/application/services/retry";
import { createTransformPerformances } from "@/application/use-cases/2_transform/transformPerformances";
import { createGetProgramText } from "@/application/use-cases/2_transform/program/getProgramText";
import { createGetProgramJSON } from "@/application/use-cases/2_transform/program/getProgramJSON";
import { imageFetcher } from "@/infrastructure/kopis/utils/image-fetcher";
import { visionService } from "@/infrastructure/vision/service";
import { geminiService } from "@/infrastructure/gemini/service";
import { uploadPosterToStorage } from "@/application/use-cases/scripts/uploadPosterToStorage";
import { callDatabaseFunction } from "@/infrastructure/supabase/database";
import supabase from "@/infrastructure/supabase/client";
import type { PerformanceDetail } from "@/shared/types/kopis";

const DEFAULT_FIXTURE_ID = "PF286762";

(async () => {
  const fixtureId = process.argv[2] ?? DEFAULT_FIXTURE_ID;

  // 1. 픽스처 로드
  const fixturePath = path.join(
    __dirname,
    "..",
    "..",
    "fixtures",
    "kopis",
    `${fixtureId}.json`,
  );
  if (!fs.existsSync(fixturePath)) {
    logger.error(
      `픽스처가 없습니다: ${fixturePath}\nscripts/test.ts의 ID를 바꿔 생성하거나, -- 인자로 다른 ID를 지정하세요.`,
    );
    process.exitCode = 1;
    return;
  }
  const fixture = JSON.parse(
    fs.readFileSync(fixturePath, "utf-8"),
  ) as PerformanceDetail;
  logger.info(`[E2E] 픽스처 로드 완료: ${fixture.mt20id} (${fixture.prfnm})`);

  // 2. 사전 점검 — 실제 호출에 필요한 키가 있는지 미리 확인한다.
  if (!process.env.GEMINI_API_KEY) {
    logger.error(
      "GEMINI_API_KEY가 없습니다. packages/backend/.env를 확인하세요 (NODE_ENV=test여도 .env의 비-Supabase 키는 유효합니다).",
    );
    process.exitCode = 1;
    return;
  }

  // 3. 실제 구현체로 transform 조립 (2_transform/index.ts와 동일한 구성)
  const transformPerformances = createTransformPerformances({
    imageFetcher,
    getProgramText: createGetProgramText({
      detectText: (buffer) => visionService.detectText(buffer),
    }),
    getProgramJSON: createGetProgramJSON({
      generateContent: (params) => geminiService.generateContent(params),
      log: logger,
    }),
    uploadPosterToStorage,
    log: logger,
  });

  // 4. 오케스트레이터 조립 — extract만 픽스처 스텁으로 갈아끼운다.
  //    maxRepeat=0: 수동 테스트는 런 내 재시도 없이 빠르게 실패해야 한다.
  //    notify/artifact는 no-op: 실제 Slack·artifact를 오염시키지 않는다.
  const syncPerformanceData = createSyncPerformanceData({
    extractPerformances: async () => ({
      performances: [fixture],
      idsToDelete: [],
    }),
    transformPerformances,
    retry,
    insertPerformancesBulk: (payload) =>
      callDatabaseFunction("upsert_performances_bulk", { payload }),
    notify: async () => {},
    saveFailuresToArtifact: () => {},
    failedRecordsFilename: "unused",
    log: logger,
  });

  // 5. 실행
  const summary = await syncPerformanceData(
    "00000000",
    "00000000",
    "00000000",
    "00000000",
    0,
  );

  if (summary.finalFailures.length > 0) {
    const byError = summary.finalFailures
      .reduce<Record<string, number>>((acc, f) => {
        const key = f.error ?? "Unknown";
        acc[key] = (acc[key] ?? 0) + 1;
        return acc;
      }, {})
      .toString();
    logger.error(
      `[E2E_FAIL] 파이프라인 최종 실패: ${JSON.stringify(byError)}`,
    );
    process.exitCode = 1;
    return;
  }

  // 6. 로컬 DB 검증 — 값 자체가 아니라 형태(적재 완전성)를 확인한다.
  const { data: row, error } = await supabase
    .from("performances")
    .select("*")
    .eq("performance_id", fixture.mt20id)
    .single();

  const failures: string[] = [];
  if (error || !row) {
    failures.push(`DB에 적재된 행이 없습니다 (${error?.message ?? "no row"})`);
  } else {
    if (row.performance_name !== fixture.prfnm)
      failures.push(`공연명 불일치: ${row.performance_name}`);
    if (row.venue_name !== fixture.fcltynm)
      failures.push(`공연장 불일치: ${row.venue_name}`);
    if (row.period_from !== fixture.prfpdfrom)
      failures.push(`시작일 불일치: ${row.period_from}`);
    if (!row.poster || !String(row.poster).includes("storage"))
      failures.push(`포스터 URL이 Storage 형태가 아님: ${row.poster}`);
    if (
      Array.isArray(row.price) &&
      row.price.length > 0 &&
      typeof row.min_price !== "number"
    )
      failures.push(`가격 파싱 결과가 숫자가 아님: ${row.min_price}`);
  }

  // program은 performances 컬럼이 아니라 RPC가 찢어 넣는 별도 programs 테이블에 저장된다.
  if (!failures.length) {
    const { data: programs, error: programsError } = await supabase
      .from("programs")
      .select("composer_ko, composer_en, title_ko, title_en")
      .eq("performance_id", fixture.mt20id);

    if (programsError || !programs || programs.length === 0) {
      failures.push(
        `programs 테이블에 산출물이 없음 — Vision OCR 또는 Gemini 단계 유실 (${programsError?.message ?? "0 rows"})`,
      );
    } else {
      logger.info(
        `[E2E] programs 적재 확인: ${programs.length}건 (예: ${programs[0].composer_ko ?? "?"} — ${programs[0].title_ko ?? "?"})`,
      );
    }
  }

  if (failures.length > 0) {
    logger.error(`[E2E_FAIL] 검증 실패:\n- ${failures.join("\n- ")}`);
    process.exitCode = 1;
    return;
  }

  logger.info(
    `[E2E_OK] 픽스처 ${fixture.mt20id} → OCR/Gemini/Storage/로컬 DB 전 구간 통과 (1차 성공 ${summary.firstPassSuccesses}건)`,
  );
})();
