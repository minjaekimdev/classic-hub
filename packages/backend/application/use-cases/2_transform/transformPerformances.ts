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
    debug: (msg: string) => void;
    error: (msg: string, meta?: Record<string, unknown>) => void;
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

    // ${error} 보간만으로는 스택이 사라지므로, Error의 스택을 meta로 별도 전달한다.
    const errorMeta = (error: unknown): Record<string, unknown> =>
      error instanceof Error ? { stack: error.stack } : {};

    const failure = (error: string): ProcessResult => ({
      id,
      error,
      data: null,
      attempts: 1,
      failedAt: new Date().toISOString(),
    });

    // 포스터 이미지 원본과 상세이미지 원본(버퍼)를 요청
    log.debug("Fetching images...");
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
      log.error(`[FETCH_FAIL] Images fetch failed (ID: ${id}): ${error}`, errorMeta(error));
      return failure("ImageFetchError");
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
        errorMeta(error),
      );
      return failure("ImageFetchError");
    }

    // Vision API 입력 픽셀 한도를 만족하기 위해 분할
    log.debug("Splitting images...");

    let splitedDetailImageBuffers: Buffer[][];
    try {
      splitedDetailImageBuffers = await Promise.all(
        processedDetailImageBuffers.map(splitLongImage),
      );
    } catch (error) {
      log.error(`[SPLIT_FAIL] Image split failed (ID: ${id}): ${error}`, errorMeta(error));
      return failure("ImageSplitError");
    }

    // 프로그램 추출
    log.debug("Extracting Program text...");

    const textFromStyField = performanceDetail.sty;
    let textFromDetailImage: string;
    try {
      textFromDetailImage = await getProgramText(
        splitedDetailImageBuffers.flat(),
      );
    } catch (error) {
      log.error(`[OCR_FAIL] Extracting Program text failed (ID: ${id}): ${error}`, errorMeta(error));
      return failure("OCRError");
    }

    if (!textFromDetailImage) {
      log.error(`[OCR_FAIL] Extracting Program text failed (ID: ${id})`);
      return failure("OCRError");
    }

    // performanceDetail.sty 필드에 데이터가 존재한다면 두 개 모두 고려
    // 존재하지 않는다면 상세 이미지만 고려하기
    const programText = textFromStyField
      ? `${textFromStyField}
    ${textFromDetailImage}
    `
      : textFromDetailImage;

    // Gemini API로 변환
    log.debug("Converting Program text to JSON...");
    let programJSON: ProgramExtractionResponse;
    try {
      programJSON = await getProgramJSON(programText);
    } catch (error) {
      log.error(
        `[GEMINI_FAIL] Converting Program text to JSON failed (ID: ${id}): ${error}`,
        errorMeta(error),
      );
      return failure("GeminiError");
    }

    // 공연 데이터의 포스터와 상세 이미지들을 WebP로 압축 후 supabase storage에 저장
    // 포스터: naturalWidth 보통 750px, 서비스에서 보여지는 최대크기 300px이므로 리사이징 필요
    // 상세 이미지: naturalWidth 보통 750px, 서비스에서 보여지는 최대크기가 700px이므로 굳이 리사이징 필요 x
    log.debug("Optimizing Images to WebP...");

    let compressedPoster;
    try {
      compressedPoster = await sharp(posterBuffer)
        .resize(300)
        .webp({ quality: 80 })
        .toBuffer();
    } catch (error) {
      log.error(`[OPTIMIZE_FAIL] Poster Optimize Failed (ID: ${id}): ${error}`, errorMeta(error));
      return failure("SharpError");
    }

    let storagePosterUrl: string;
    try {
      storagePosterUrl = await uploadPosterToStorage(id, compressedPoster);
    } catch (error) {
      // DB 적재 실패는 오케스트레이터의 [INSERT_FAIL]이 담당하므로 Storage 실패는 [STORAGE_FAIL]로 구별한다.
      log.error(`[STORAGE_FAIL] Storage Upload Failed (ID: ${id}): ${error}`, errorMeta(error));
      return failure("StorageError");
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
