// 공연 ID만 입력해서 transform 파이프라인(이미지 페칭 → sanitize → 분할 → Vision OCR → Gemini)을
// 로컬에서 단일 실행해보는 디버깅 스크립트.
// - 재시도 없이 1회만 실행한다. (프로덕션의 재시도는 오케스트레이터의 retry가 담당하므로,
//   transformPerformances를 직접 호출하는 이 스크립트에는 재시도가 없다)
// - 사이드 이펙트 없음: DB 적재 X, Storage 업로드 X, Slack 알림 X. 파이프라인 로그만 콘솔에 출력된다.
// - 사용법:
//     npm run debug-performance -- PF301377
//     npm run debug-performance -- PF301377 PF301378   # 여러 건 순차 실행
// - 진행 로그(Fetching images... 등)까지 보려면 LOG_LEVEL=debug를 붙일 것.

import logger from "@/shared/utils/logger";
import { kopisService } from "@/infrastructure/kopis/service";
import { createTransformPerformances } from "@/application/use-cases/2_transform/transformPerformances";
import { createGetProgramText } from "@/application/use-cases/2_transform/program/getProgramText";
import { createGetProgramJSON } from "@/application/use-cases/2_transform/program/getProgramJSON";
import { imageFetcher } from "@/infrastructure/kopis/utils/image-fetcher";
import { kopisRateLimiter } from "@/application/services/kopisRateLimiter";
import { visionService } from "@/infrastructure/vision/service";
import { geminiService } from "@/infrastructure/gemini/service";

const performanceIds = process.argv.slice(2);

const usage = () => "사용법: npm run debug-performance -- <공연ID> [추가ID...]";

(async () => {
  if (performanceIds.length === 0) {
    logger.error(`공연 ID를 입력하세요.\n${usage()}`);
    process.exitCode = 1;
    return;
  }

  if (!process.env.KOPIS_SERVICE_KEY || !process.env.GEMINI_API_KEY) {
    logger.error(
      "KOPIS_SERVICE_KEY와 GEMINI_API_KEY가 필요합니다. packages/backend/.env를 확인하세요.",
    );
    process.exitCode = 1;
    return;
  }

  // transform 조립 (2_transform/index.ts와 동일한 실제 구현체 구성).
  // 유일한 차이는 uploadPosterToStorage를 no-op으로 갈아끼운 것 —
  // 로컬 원인 분석에는 저장이 필요 없고 부수 작업은 오염이므로 생략한다.
  const transformPerformances = createTransformPerformances({
    imageFetcher: (url, message) =>
      kopisRateLimiter.execute(() => imageFetcher(url, message)),
    getProgramText: createGetProgramText({
      detectText: (buffer) => visionService.detectText(buffer),
    }),
    getProgramJSON: createGetProgramJSON({
      // flash-lite는 반복 루프로 출력이 절단되는 문제가 있어(PF301377 재현), 디버깅 시에는 flash를 쓴다.
      model: "gemini-2.5-flash",
      generateContent: (params) => geminiService.generateContent(params),
      log: logger,
    }),
    uploadPosterToStorage: async () => "debug:upload-skipped",
    log: logger,
  });

  logger.info(
    `[DEBUG] 시작 — ${performanceIds.length}건 순차 단일 실행 (재시도·DB·Storage·Slack 없음)`,
  );

  const stillFailed: string[] = [];

  for (const id of performanceIds) {
    logger.info(`\n========== [DEBUG] ${id} ==========`);

    let detail;
    try {
      detail = await kopisService.getPerformanceDetail(id);
    } catch (error) {
      logger.error(`[DEBUG] ${id} KOPIS 상세 페칭 실패: ${error}`);
      stillFailed.push(id);
      continue;
    }

    const result = await transformPerformances(detail);

    if (result.error) {
      logger.error(`[DEBUG] ${id} 실패 → ${result.error}`);
      stillFailed.push(id);
    } else {
      logger.info(`[DEBUG] ${id} 성공`);
    }
  }

  logger.info(
    `\n[DEBUG] 완료 — 성공 ${performanceIds.length - stillFailed.length}건 / 실패 ${stillFailed.length}건${
      stillFailed.length ? `\n${stillFailed.join("\n")}` : ""
    }`,
  );

  if (stillFailed.length > 0) process.exitCode = 1;
})().catch((error) => {
  logger.error("[DEBUG] 실행이 비정상 종료됐습니다.", error);
  process.exitCode = 1;
});
