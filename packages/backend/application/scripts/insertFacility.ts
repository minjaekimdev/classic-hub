// 전체 공연시설을 DB에 import하는 파일
// 최초 1회만 수행하므로, use-cases가 아닌 scripts 폴더에 둔다
import { API_URL, SERVICE_KEY } from "@/infrastructure/kopis/client";
import RateLimiter from "shared/utils/rateLimiter";
import { kopisFetcher } from "../../infrastructure/kopis/utils/fetcher";
import logger from "shared/utils/logger";
import getFacilityDetail from "./getFacilityDetail";
import insertFacilityToDB from "../use-cases/scripts/insertFacilityToDB";

// 공연시설 목록 조회
const getFacilityAndInsertToDB = async () => {
  let page = 1;

  while (true) {
    logger.info(`[FACILITY] page: ${page}`);
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

        // 개별 공연장의 실패가 전체 스크립트를 중단시키지 않도록 여기서 catch한다.
        try {
          const facility = await KOPISrateLimiter.execute(() =>
            getFacilityDetail(mt10id),
          );
          await insertFacilityToDB(facility);
        } catch (error) {
          logger.warn(
            `[FACILITY_FAIL] facility 처리 실패 (mt10id: ${mt10id}): ${error}`,
          );
        }
      }),
    );
  }
};

const KOPISrateLimiter = new RateLimiter(100);
(async () => {
  await getFacilityAndInsertToDB();
})();
