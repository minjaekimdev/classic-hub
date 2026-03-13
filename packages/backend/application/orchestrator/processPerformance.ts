import getProgramJSON from "@/application/use-cases/gemini/getProgramJSON";
import optimizeAndUpload from "@/application/use-cases/images/optimzeAndUpload";
import getImageBuffer from "@/application/use-cases/kopis/getImageBuffer";
import {
  getPerformanceDetail,
  toMappedPerformanceDetail,
} from "@/application/use-cases/kopis/getPerformanceDetailArray";
import getProgramText from "@/application/use-cases/vision/getProgramText";
import { ProcessResult } from "shared/types/sync";
import logger from "../../shared/utils/logger";

export const processPerformance = async (id: string): Promise<ProcessResult> => {
  logger.info("Fetching Performance...");
  const performanceDetail = await getPerformanceDetail(id);

  if (!performanceDetail) {
    logger.error("[FETCH_FAIL] Performance fetch failed");
    return {
      id,
      error: "PerformanceFetchError",
      data: null,
    };
  }

  // 이미지 페칭 (포스터 + 상세이미지)
  const posterUrl = performanceDetail.poster;
  const rawDetailUrls = performanceDetail.styurls.styurl;
  const detailUrlArray = Array.isArray(rawDetailUrls)
    ? rawDetailUrls
    : [rawDetailUrls];

  // 포스터 이미지 원본과 상세이미지 원본(버퍼)를 요청
  logger.info("Fetching images...");
  const result = await getImageBuffer(posterUrl, detailUrlArray);

  if (!result) {
    logger.error("[FETCH_FAIL] Images fetch failed");
    return {
      id,
      error: "ImageFetchError",
      data: null,
    };
  }

  const { posterBuffer, detailBuffers } = result;

  // 프로그램 추출
  // sty 필드가 존재한다면 해당 텍스트 활용, 존재하지 않는다면 OCR에 이미지 넣어 텍스트 추출
  logger.info("Extracting Program text...");
  const programText =
    performanceDetail.sty || (await getProgramText(detailBuffers));

  if (!programText) {
    logger.error("[OCR_FAIL] Extracting Program text failed");
    return {
      id,
      error: "OCRError",
      data: null,
    };
  }

  // Gemini API로 변환
  logger.info("Converting Program text to JSON...");
  const programJSON = await getProgramJSON(programText);

  if (!programJSON) {
    logger.error("[GEMINI_FAIL] Converting Program text to JSON failed");
    return {
      id,
      error: "GeminiError",
      data: null,
    };
  }

  // 공연 데이터의 포스터와 상세 이미지들을 WebP로 압축 후 supabase storage에 저장
  // 포스터: naturalWidth 보통 750px, 서비스에서 보여지는 최대크기 300px이므로 리사이징 필요
  // 상세 이미지: naturalWidth 보통 750px, 서비스에서 보여지는 최대크기가 700px이므로 굳이 리사이징 필요 x
  logger.info("Optimizing Images to WebP...");
  const storageResult = await optimizeAndUpload(
    id,
    posterBuffer,
    detailBuffers,
  );
  if (!storageResult) {
    logger.error("[UPLOAD_FAIL] Image processing/upload failed");
    return { id, error: "ImageProcessError", data: null };
  }

  const { storagePosterUrl, storageDetailUrls } = storageResult;

  const processedPerformance = toMappedPerformanceDetail(
    performanceDetail,
    programJSON,
    storagePosterUrl,
    storageDetailUrls,
  );

  return {
    id,
    error: null,
    data: processedPerformance,
  };
};
