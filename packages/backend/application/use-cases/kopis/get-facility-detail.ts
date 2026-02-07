import { kopisFetcher } from "@/application/services/kopis/kopis-fetcher";
import { removeTextProperty } from "@/application/services/kopis/kopis-preprocessor";
import { API_URL, SERVICE_KEY } from "@/infrastructure/external-api/kopis";
import { Facility } from "@/models/kopis";
import { withErrorHandling } from "utils/error";
import logger from "utils/logger";

// 공연시설 상세 조회
const getFacilityDetail = async (mt10id: string) => {
  return withErrorHandling(
    async () => {
      const parsedData = await kopisFetcher(
        `${API_URL}/prfplc/${mt10id}?service=${SERVICE_KEY}`,
      );

      const result = removeTextProperty(parsedData.dbs.db);
      return result as unknown as Facility;
    },
    () => {
      logger.warn(`[FETCH_FAIL] facility detail fetch failed: ${mt10id}`);
    },
    "kopis",
  );
};

export default getFacilityDetail;