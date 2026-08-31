import { kopisFetcher } from "@/infrastructure/kopis/utils/fetcher";
import { removeTextProperty } from "@/infrastructure/kopis/utils/preprocessor";
import { API_URL, SERVICE_KEY } from "@/infrastructure/kopis/client";
import { Facility } from "shared/types/kopis";

// 공연시설 상세 조회
// 실패 시 에러를 그대로 던지며, 건너뛰기 정책은 호출자 스크립트(insertFacility)가 담당한다.
const getFacilityDetail = async (mt10id: string): Promise<Facility> => {
  const parsedData = await kopisFetcher(
    `${API_URL}/prfplc/${mt10id}?service=${SERVICE_KEY}`,
  );

  const result = removeTextProperty(parsedData.dbs.db);
  return result as unknown as Facility;
};

export default getFacilityDetail;
