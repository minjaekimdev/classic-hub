import sharp from "sharp";
import { ProcessResult } from "shared/types/sync";
import { PerformanceDetail } from "@/shared/types/kopis";
import { ProgramExtractionResponse } from "shared/types/gemini";
import { sanitizeImageBuffer } from "./program/sanitizeImageBuffer";
import { splitLongImage } from "./program/splitLongImage";
import { toDbPerformance } from "../3_load/mappers/toDbPerformance";

export interface TransformPerformancesDeps {
  imageFetcher: (url: string, message: string) => Promise<Buffer>;
  getProgramText: (images: Buffer[]) => Promise<string>;
  getProgramJSON: (
    programText: string,
  ) => Promise<ProgramExtractionResponse>;
  uploadPosterToStorage: (
    id: string,
    compressedPoster: Buffer,
  ) => Promise<string>;
  log: {
    info: (msg: string) => void;
    error: (msg: string) => void;
  };
}

// 공연 1건을 변환하는 항목 단위 오케스트레이터이자 에러 정책 계층.
// 하위 함수들은 에러를 그대로 던지고, 이곳에서 catch하여
// ProcessResult 에러 객체로 변환한다. (개별 공연의 실패가 전체 파이프라인을 중단시키지 않게 하기 위함)
export const createTransformPerformances = ({
  imageFetcher,
  getProgramText,
  getProgramJSON,
  uploadPosterToStorage,
  log,
}: TransformPerformancesDeps) => {
  return async (
    performanceDetail: PerformanceDetail,
  ): Promise<ProcessResult> => {
    // 이미지 페칭 (포스터 + 상세이미지)
    const posterUrl = performanceDetail.poster;
    const rawDetailUrls = performanceDetail.styurls.styurl;
    const id = performanceDetail.mt20id;
    const detailUrlArray = Array.isArray(rawDetailUrls)
      ? rawDetailUrls
      : [rawDetailUrls];

    // 포스터 이미지 원본과 상세이미지 원본(버퍼)를 요청
    log.info("Fetching images...");
    let posterBuffer: Buffer;
    let detailImageBuffers: Buffer[];
    try {
      posterBuffer = await imageFetcher(
        posterUrl,
        `[FETCH_FAIL] Poster Image Fetch Failed (ID: ${id})`,
      );
      detailImageBuffers = await Promise.all(
        detailUrlArray.map(async (url) =>
          imageFetcher(
            url,
            `[FETCH_FAIL] Detail Image Fetch Failed (ID: ${id})`,
          ),
        ),
      );
    } catch (error) {
      log.error(`[FETCH_FAIL] Images fetch failed (ID: ${id}): ${error}`);
      return {
        id,
        error: "ImageFetchError",
        data: null,
      };
    }

    // 상세 이미지 버퍼에 있는 더미 데이터 삭제
    let processedDetailImageBuffers: Buffer[];
    try {
      processedDetailImageBuffers = await Promise.all(
        detailImageBuffers.map(sanitizeImageBuffer),
      );
    } catch (error) {
      log.error(
        `[OPTIMIZE_FAIL] Detail Images Optimization Failed (ID: ${id}): ${error}`,
      );
      return {
        id,
        error: "ImageFetchError",
        data: null,
      };
    }

    // Vision API 입력 픽셀 한도를 만족하기 위해 분할
    log.info("Splitting images...");

    let splitedDetailImageBuffers: Buffer[][];
    try {
      splitedDetailImageBuffers = await Promise.all(
        processedDetailImageBuffers.map(splitLongImage),
      );
    } catch (error) {
      log.error(`[SPLIT_FAIL] Image split failed (ID: ${id}): ${error}`);
      return {
        id,
        error: "ImageSplitError",
        data: null,
      };
    }

    // 프로그램 추출
    log.info("Extracting Program text...");

    const textFromStyField = performanceDetail.sty;
    let textFromDetailImage: string;
    try {
      textFromDetailImage = await getProgramText(
        splitedDetailImageBuffers.flat(),
      );
    } catch (error) {
      log.error(`[OCR_FAIL] Extracting Program text failed (ID: ${id}): ${error}`);
      return {
        id,
        error: "OCRError",
        data: null,
      };
    }

    if (!textFromDetailImage) {
      log.error(`[OCR_FAIL] Extracting Program text failed (ID: ${id})`);
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
    log.info("Converting Program text to JSON...");
    let programJSON: ProgramExtractionResponse;
    try {
      programJSON = await getProgramJSON(programText);
    } catch (error) {
      log.error(
        `[GEMINI_FAIL] Converting Program text to JSON failed (ID: ${id}): ${error}`,
      );
      return {
        id,
        error: "GeminiError",
        data: null,
      };
    }

    // 공연 데이터의 포스터와 상세 이미지들을 WebP로 압축 후 supabase storage에 저장
    // 포스터: naturalWidth 보통 750px, 서비스에서 보여지는 최대크기 300px이므로 리사이징 필요
    // 상세 이미지: naturalWidth 보통 750px, 서비스에서 보여지는 최대크기가 700px이므로 굳이 리사이징 필요 x
    log.info("Optimizing Images to WebP...");

    let compressedPoster;
    try {
      compressedPoster = await sharp(posterBuffer)
        .resize(300)
        .webp({ quality: 80 })
        .toBuffer();
    } catch (error) {
      log.error(`[OPTIMIZE_FAIL] Poster Optimize Failed (ID: ${id}): ${error}`);
      return {
        id,
        error: "SharpError",
        data: null,
      };
    }

    let storagePosterUrl: string;
    try {
      storagePosterUrl = await uploadPosterToStorage(id, compressedPoster);
    } catch (error) {
      log.error(`[INSERT_FAIL] Storage Insert Failed (ID: ${id}): ${error}`);
      return {
        id,
        error: "StorageError",
        data: null,
      };
    }

    const processedPerformance = toDbPerformance(
      performanceDetail,
      programJSON,
      storagePosterUrl,
      detailUrlArray,
    );

    return {
      id,
      error: null,
      data: processedPerformance,
    };
  };
};
