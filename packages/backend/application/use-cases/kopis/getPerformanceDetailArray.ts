import { PerformanceDetail } from "@/models/kopis";
import { withErrorHandling } from "utils/error";
import { API_URL, SERVICE_KEY } from "@/infrastructure/external-api/kopis";
import { kopisFetcher } from "@/application/services/kopis/kopisFetcher";
import { removeTextProperty } from "@/application/services/kopis/kopisPreprocessor";
import {
  getParsedPrice,
  getParsedBookingLinks,
} from "@/application/services/kopis/parser";
import RateLimiter from "utils/rateLimiter";
import { Json } from "@classic-hub/shared/types/supabase";
import { getMinMaxPrice } from "./getMinMaxPrice";
import { DBPerformanceWrite } from "@classic-hub/shared/types/database";
import getDetailImage from "./getDetailImage";
import logger from "utils/logger";
import getProgramText from "../vision/getProgramText";
import getProgramJSON from "../gemini/getProgramJSON";
import { ProgramExtractionResponse } from "@/models/gemini";
import sharp from "sharp";
import { uploadToStorage } from "@/infrastructure/database";

const toMappedPerformanceDetail = (
  performanceDetail: PerformanceDetail,
  programJSON: ProgramExtractionResponse,
  storagePosterUrl: string,
  storageDetailUrls: string[],
): DBPerformanceWrite => {
  const {
    mt20id,
    mt10id,
    prfnm,
    prfpdfrom,
    prfpdto,
    fcltynm,
    prfcast,
    prfruntime,
    prfage,
    pcseguidance,
    poster,
    prfstate,
    relates,
    styurls,
    dtguidance,
    area,
    ...rest
  } = performanceDetail;

  const priceArr = getParsedPrice(pcseguidance); // 빈 배열 혹은 가격 배열 리턴
  const { minPrice, maxPrice } = getMinMaxPrice(priceArr);

  return {
    performance_id: mt20id,
    venue_id: mt10id,
    performance_name: prfnm,
    area,
    period_from: prfpdfrom,
    period_to: prfpdto,
    venue_name: fcltynm,
    cast: prfcast,
    runtime: prfruntime,
    age: prfage,
    price: priceArr as unknown as Json,
    min_price: minPrice,
    max_price: maxPrice,
    poster: storagePosterUrl,
    state: prfstate,
    booking_links: getParsedBookingLinks(relates.relate) as unknown as Json,
    detail_image: storageDetailUrls,
    time: dtguidance,
    raw_data: rest, // 나머지 15개 내외의 데이터가 JSON 형태로 들어감
    program: programJSON as unknown as Json,
  };
};

export const getPerformanceDetail = async (
  performanceId: string,
): Promise<PerformanceDetail | null> => {
  return withErrorHandling(
    async () => {
      const parsedData = await kopisFetcher(
        `${API_URL}/pblprfr/${performanceId}?service=${SERVICE_KEY}`,
      );

      const result = removeTextProperty(
        parsedData.dbs.db,
      ) as unknown as PerformanceDetail;

      return result;
    },
    null,
    "kopis",
  );
};

// KOPIS에 idsToInsert에 있는 공연들에 대한 상세 데이터를 받아온 뒤 DB 엔티티에 맞게 매핑하여 반환하는 함수
export const getPerformaceDetailArray = async (
  idsToInsert: string[],
  rateLimiter: RateLimiter,
) => {
  // successes에는 가져오는 데 성공한 공연 데이터를 저장
  // failures에는 가져오는 데 실패한 공연 데이터의 id와 error를 저장
  const successes: DBPerformanceWrite[] = [];
  const failures: { id: string; error: any }[] = [];

  for (const id of idsToInsert) {
    const performanceDetail = await rateLimiter.execute(async () => {
      return await getPerformanceDetail(id);
    });

    if (!performanceDetail) {
      failures.push({ id, error: "APIError" });
      continue;
    }

    // 이미지 페칭 (포스터 + 상세이미지)

    const posterUrl = performanceDetail.poster;
    const rawDetailUrls = performanceDetail.styurls.styurl;
    const detailUrlArray = Array.isArray(rawDetailUrls)
      ? rawDetailUrls
      : [rawDetailUrls];
    
    // 포스터 이미지 원본과 상세이미지 원본(버퍼)를 요청
    logger.info("Fetching images...");
    const [posterBuffer, detailBuffers] = await withErrorHandling(
      () =>
        Promise.all([
          getDetailImage(posterUrl),
          Promise.all(detailUrlArray.map((url) => getDetailImage(url))),
        ]),
      [null, null],
      "kopis",
    );

    if (!posterBuffer || !detailBuffers) {
      logger.error(`[FETCH_FAIL] Images fetch failed (ID: ${id})`);
      failures.push({ id, error: "ImageFetchError" });
      continue;
    }

    // 프로그램 추출 
    // sty 필드가 존재한다면 해당 텍스트 활용, 존재하지 않는다면 OCR에 이미지 넣어 텍스트 추출
    logger.info("Extracting Program text...");
    const programText =
      performanceDetail.sty || (await getProgramText(detailBuffers));

    if (!programText) {
      logger.error("[OCR_FAIL] Extracting Program text failed");
      failures.push({ id, error: "OCRError" });
      continue;
    }

    // Gemini API로 변환
    logger.info("Converting Program text to JSON...");
    const programJSON = await getProgramJSON(programText);

    if (!programJSON) {
      logger.error("[GEMINI_FAIL] Converting Program text to JSON failed");
      failures.push({ id, error: "GeminiError" });
    }

    // 공연 데이터의 포스터와 상세 이미지들을 WebP로 압축 후 supabase storage에 저장
    // 포스터: naturalWidth 보통 750px, 서비스에서 보여지는 최대크기 300px이므로 리사이징 필요
    // 상세 이미지: naturalWidth 보통 750px, 서비스에서 보여지는 최대크기가 700px이므로 굳이 리사이징 필요 x
    logger.info("Compressing Images to WebP...");
    try {
      const compressedPoster = await sharp(posterBuffer)
        .resize(300)
        .webp({ quality: 80 })
        .toBuffer();
      const storagePosterUrl = await uploadToStorage(
        "performances",
        // 파일 중복 및 브라우저 캐시 갱신을 위해 Date.now() 사용
        `${id}/poster_${Date.now()}.webp`,
        compressedPoster,
      );

      // 상세 이미지들 압축 및 업로드 (병렬 처리)
      const storageDetailUrls = await Promise.all(
        detailBuffers.map(async (buf, idx) => {
          const compressed = await sharp(buf).webp({ quality: 80 }).toBuffer();
          return await uploadToStorage(
            "performances",
            `${id}/detail_${idx}_${Date.now()}.webp`,
            compressed,
          );
        }),
      );

      const result = toMappedPerformanceDetail(
        performanceDetail,
        programJSON,
        storagePosterUrl,
        storageDetailUrls,
      );

      successes.push(result);
    } catch (uploadError) {
      logger.error(
        `[UPLOAD_FAIL] Image processing/upload failed (ID: ${id}): ${uploadError}`,
      );
      failures.push({ id, error: "ImageProcessError" });
    }
  }

  return { successes, failures };
};
