import getProgramJSON from "@/application/use-cases/gemini/getProgramJSON";
import {
  getPerformanceDetail,
  toMappedPerformanceDetail,
} from "@/application/use-cases/kopis/getPerformanceDetailArray";
import getProgramText from "@/application/use-cases/vision/getProgramText";
import { ProcessResult } from "shared/types/sync";
import logger from "../../shared/utils/logger";
import { imageFetcher } from "@/shared/utils/imageFetcher";
import { splitLongImage } from "../use-cases/vision/splitLongImage";
import { uploadDetailImagesToStorage } from "../use-cases/database/uploadDetailImagesToStorage";
import sharp from "sharp";
import { uploadPosterToStorage } from "../use-cases/database/uploadPosterToStorage";
import { sanitizeImageBuffer } from "../use-cases/sharp/sanitizeImageBuffer";

export const processPerformance = async (
  id: string,
): Promise<ProcessResult> => {
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
  const posterBuffer = await imageFetcher(
    posterUrl,
    `[FETCH_FAIL] Poster Image Fetch Failed (ID: ${id})`,
  );
  const detailImageBuffers = await Promise.all(
    detailUrlArray.map(async (url) =>
      imageFetcher(url, `[FETCH_FAIL] Detail Image Fetch Failed (ID: ${id}))`),
    ),
  );

  // posterBuffer 페칭에 실패했거나 detailImageBuffers 배열에서 null인 요소가 하나라도 있다면 에러 객체를 리턴
  if (!posterBuffer || detailImageBuffers.some((item) => !item)) {
    logger.error("[FETCH_FAIL] Images fetch failed");
    return {
      id,
      error: "ImageFetchError",
      data: null,
    };
  }

  // 상세 이미지 버퍼에 있는 더미 데이터 삭제
  const processedDetailImageBuffers = await Promise.all(
    detailImageBuffers.map(sanitizeImageBuffer),
  );

  if (processedDetailImageBuffers.some((item) => item === null)) {
    logger.error("[OPTIMIZE_FAIL] Detail Images Optimization Failed");
    return {
      id,
      error: "ImageFetchError",
      data: null,
    };
  }

  // Vision API 입력 픽셀 한도를 만족하기 위해 분할
  logger.info("Splitting images...");

  const splitedDetailImageBuffers = await Promise.all(
    processedDetailImageBuffers.map(splitLongImage),
  );
  if (splitedDetailImageBuffers.some((item) => !item)) {
    return {
      id,
      error: "ImageSplitError",
      data: null,
    };
  }

  // 프로그램 추출
  logger.info("Extracting Program text...");

  const textFromStyField = performanceDetail.sty;
  const textFromDetailImage =
    (await getProgramText(splitedDetailImageBuffers.flat())) ?? "";

  if (!textFromDetailImage) {
    logger.error(`[OCR_FAIL] Extracting Program text failed (ID: ${id})`);
    return {
      id,
      error: "OCRError",
      data: null,
    };
  }

  // performanceDetail.sty 필드에 데이터가 존재한다면 두 개 모두 고려
  // 존재하지 않는다면 상세 이미지만 고려하기
  const programText = textFromStyField
    ? `${textFromStyField}
    ${textFromDetailImage}
    `
    : textFromDetailImage;

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

  let compressedPoster;
  try {
    compressedPoster = await sharp(posterBuffer)
      .resize(300)
      .webp({ quality: 80 })
      .toBuffer();
  } catch (error) {
    logger.error("[OPTIMIZE_FAIL] Poster Optimize Failed");
    return {
      id,
      error: "SharpError",
      data: null,
    };
  }

  const storagePosterUrl = await uploadPosterToStorage(id, compressedPoster);

  if (!storagePosterUrl) {
    logger.error("[INSERT_FAIL] Storage Insert Failed");
    return {
      id,
      error: "StorageError",
      data: null,
    };
  }

  const storageDetailUrls = await uploadDetailImagesToStorage(
    id,
    processedDetailImageBuffers,
  );

  if (!storageDetailUrls) {
    logger.error("[INSERT_FAIL] Storage Insert Failed");
    return {
      id,
      error: "StorageError",
      data: null,
    };
  }

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
