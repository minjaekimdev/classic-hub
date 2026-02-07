// 전체 공연시설을 DB에 import하는 파일
import { API_URL, SERVICE_KEY } from "@/infrastructure/external-api/kopis";
import RateLimiter from "utils/rateLimiter";
import { kopisFetcher } from "../../application/services/kopis/kopis-fetcher";
import getFacilityDetail from "../../application/use-cases/kopis/get-facility-detail";
import insertFacilityToDB from "../../application/use-cases/supabase/insert-facility-to-db";

// 공연시설 목록 조회
const getFacilityAndInsertToDB = async () => {
  let page = 1;

  while (true) {
    console.log(`page: ${page}`);
    const parsedData = await kopisFetcher(
      `${API_URL}/prfplc?service=${SERVICE_KEY}&cpage=${page++}&rows=100`,
    );

    // 배열로 구성된 공연장 목록 데이터(전처리 이전)
    const rawArray = parsedData.dbs.db;
    if (!rawArray) break;

    // 데이터가 1개일 때 객체로 오는 경우 방어 코드
    const facilityList = Array.isArray(rawArray) ? rawArray : [rawArray];

    await Promise.all(
      facilityList.map(async (item: any) => {
        // 목록에서는 아직 _text가 남아있으므로 ._text로 접근
        const mt10id = item.mt10id._text;

        const facility = await KOPISrateLimiter.execute(() =>
          getFacilityDetail(mt10id),
        );

        // null 체크: facility가 null이 아닐 때만 저장
        if (facility) {
          await insertFacilityToDB(facility);
        }
      }),
    );
  }
};

const KOPISrateLimiter = new RateLimiter(100);
(async () => {
  await getFacilityAndInsertToDB();
})();
