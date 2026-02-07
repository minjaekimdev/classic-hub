import { PerformanceDetail } from "@/models/kopis";
import { withErrorHandling } from "utils/error";
import { API_URL, SERVICE_KEY } from "@/infrastructure/external-api/kopis";
import { DBPerformance } from "@classic-hub/shared/types/database";
import { kopisFetcher } from "@/application/services/kopis/kopis-fetcher";
import { removeTextProperty } from "@/application/services/kopis/kopis-preprocessor";
import { getParsedPrice, getParsedBookingLinks } from "@/application/services/kopis/parser";
import RateLimiter from "utils/rateLimiter";

const getMappedPerformanceDetail = (
  performanceDetail: PerformanceDetail,
): DBPerformance => {
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
    price: getParsedPrice(pcseguidance), // 필요시 여기서 파싱 로직 추가
    poster: poster,
    state: prfstate,
    booking_links: getParsedBookingLinks(relates.relate),
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
export const getPerformaceDetailArray = async (idsToInsert: string[], rateLimiter: RateLimiter) => {
  // 상세 데이터를 가져오는 데 성공한 공연, 실패한 공연 id를 따로 저장
  const successes: DBPerformance[] = [];
  const failures: { id: string; error: any }[] = [];

  for (const id of idsToInsert) {
    const performanceDetail = await rateLimiter.execute(async () => {
      return await getPerformanceDetail(id);
    });

    if (!performanceDetail) {
      failures.push({ id, error: "APIError" });
      continue;
    }
    successes.push(getMappedPerformanceDetail(performanceDetail));
  }

  return { successes, failures };
};
