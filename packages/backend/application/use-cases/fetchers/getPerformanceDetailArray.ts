import { PerformanceDetail } from "shared/types/kopis";
import { withErrorHandling } from "shared/utils/error";
import { API_URL, SERVICE_KEY } from "@/infrastructure/external-api/kopis";
import { kopisFetcher } from "@/application/services/kopisFetcher";
import { removeTextProperty } from "@/application/services/kopisPreprocessor";
import {
  getParsedPrice,
  getParsedBookingLinks,
} from "@/application/services/parser";
import { Json } from "@classic-hub/shared/types/supabase";
import { getMinMaxPrice } from "../../services/getMinMaxPrice";
import { DBPerformanceWrite } from "@classic-hub/shared/types/database";
import { ProgramExtractionResponse } from "shared/types/gemini";

export const toMappedPerformanceDetail = (
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
