import { getMinMaxPrice } from "@/application/services/getMinMaxPrice";
import {
  getParsedPrice,
  getParsedBookingLinks,
} from "@/application/services/parser";
import { ProgramExtractionResponse } from "@/shared/types/gemini";
import { PerformanceDetail } from "@/shared/types/kopis";
import { Json } from "@classic-hub/shared/types/supabase";

export const toDbPerformance = (
  performanceDetail: PerformanceDetail,
  programJSON: ProgramExtractionResponse,
  storagePosterUrl: string,
  detailUrlArray: string[],
) => {
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
    detail_image: detailUrlArray,
    state: prfstate,
    booking_links: getParsedBookingLinks(relates.relate) as unknown as Json,
    time: dtguidance,
    raw_data: rest, // 나머지 15개 내외의 데이터가 JSON 형태로 들어감
    program: programJSON as unknown as Json,
  };
};
