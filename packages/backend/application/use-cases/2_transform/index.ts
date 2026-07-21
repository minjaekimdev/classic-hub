// 컴포지션 루트: 실제 인프라 구현체를 주입해서 '실제' use-case 함수를 생성한다.
// 앱 전체에서 create* 팩토리를 직접 부르지 않고 이곳에서 만든 함수를 사용한다.
import logger from "@/shared/utils/logger";
import { imageFetcher } from "@/infrastructure/kopis/utils/image-fetcher";
import { geminiService } from "@/infrastructure/gemini/service";
import { visionService } from "@/infrastructure/vision/service";
import { uploadPosterToStorage } from "../scripts/uploadPosterToStorage";
import { createGetProgramJSON } from "./program/getProgramJSON";
import { createGetProgramText } from "./program/getProgramText";
import { createTransformPerformances } from "./transformPerformances";

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
  imageFetcher,
  getProgramText,
  getProgramJSON,
  uploadPosterToStorage,
  log: logger,
});
