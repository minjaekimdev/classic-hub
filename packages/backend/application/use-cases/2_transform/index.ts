// 컴포지션 루트: 실제 인프라 구현체를 주입해서 '실제' use-case 함수를 생성한다.
// 앱 전체에서 create* 팩토리를 직접 부르지 않고 이곳에서 만든 함수를 사용한다.
import logger from "@/shared/utils/logger";
import { imageFetcher } from "@/infrastructure/kopis/utils/image-fetcher";
import { kopisRateLimiter } from "@/application/services/kopisRateLimiter";
import { geminiService } from "@/infrastructure/gemini/service";
import { visionService } from "@/infrastructure/vision/service";
import { uploadPosterToStorage } from "../scripts/uploadPosterToStorage";
import { createGetProgramJSON } from "./program/getProgramJSON";
import { createGetProgramText } from "./program/getProgramText";
import { createTransformPerformances } from "./transformPerformances";

// KOPIS 정적 이미지 서버의 초당 10회 제한(문의 확인)을 지키기 위해 limiter로 감싼다.
// extract와 직렬 실행이라 API 메타데이터 limiter(kopisRateLimiter)를 공유한다.
// TRANSFORM_CONCURRENCY를 올리더라도 이미지 버스트가 이 limiter 하나로 통제된다.
const rateLimitedImageFetcher = (url: string, message: string) =>
  kopisRateLimiter.execute(() => imageFetcher(url, message));

// OCR로 이미지에서 텍스트 추출
const getProgramText = createGetProgramText({
  detectText: (buffer) => visionService.detectText(buffer),
});

// Gemini로 프로그램 텍스트를 구조화된 JSON으로 변환
const getProgramJSON = createGetProgramJSON({
  generateContent: (params) => geminiService.generateContent(params),
  log: logger,
});

// 최상위 use-case: transformPerformances 조립
export const transformPerformances = createTransformPerformances({
  imageFetcher: rateLimitedImageFetcher,
  getProgramText,
  getProgramJSON,
  uploadPosterToStorage,
  log: logger,
});
