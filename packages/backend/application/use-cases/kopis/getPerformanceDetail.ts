import { PerformanceDetail } from "@/models/kopis";
import { APIError, withErrorHandling } from "utils/error";
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
import ocr from "@/infrastructure/external-api/vision";
import getProgramText from "../vision/getProgramText";

const toMappedPerformanceDetail = async (
  performanceDetail: PerformanceDetail,
): Promise<DBPerformanceWrite> => {
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
    poster: poster,
    state: prfstate,
    booking_links: getParsedBookingLinks(relates.relate) as unknown as Json,
    detail_image: Array.isArray(styurls.styurl)
      ? styurls.styurl
      : [styurls.styurl], // 배열로 통일
    time: dtguidance,
    raw_data: rest, // 나머지 15개 내외의 데이터가 JSON 형태로 들어감
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

    // 이미지를 여기서 페칭후 활용하기 (받아온 이미지를 OCR과 WebP 압축에 모두 사용해야 함)
    const raw = performanceDetail.styurls.styurl;
    const imgUrlArray = Array.isArray(raw) ? raw : [raw];

    const images = await withErrorHandling(
      () => Promise.all(imgUrlArray.map((url) => getDetailImage(url))),
      null,
      "kopis",
    );

    // 상세 이미지를 하나라도 받아오는 데 실패한 경우 다음 공연 데이터 진행
    if (!images) {
      logger.error(`[FETCH_FAIL] Detail Image fetch failed (ID: ${id}`);
      continue;
    }

    // sty 필드가 존재한다면 해당 텍스트를 Gemini에게 인식
    // 존재하지 않는다면 OCR 활용 후 Gemini에게 인식
    const programText = performanceDetail.sty || await getProgramText(images);

    if (!programText) {
      failures.push({ id, error: "OCRError" })
      continue;
    }

    // 공연 데이터의 포스터와 상세 이미지들을 WebP로 압축 후 supabase storage에 저장

    const result = await toMappedPerformanceDetail(performanceDetail);
    // successes.push(toMappedPerformanceDetail(performanceDetail));
  }

  return { successes, failures };
};
