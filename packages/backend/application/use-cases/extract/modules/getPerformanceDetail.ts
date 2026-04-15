import { API_URL, SERVICE_KEY } from "@/infrastructure/external-api/kopis";
import { kopisFetcher } from "@/application/services/kopisFetcher";
import { removeTextProperty } from "@/application/services/kopisPreprocessor";
import { PerformanceDetail } from "@/shared/types/kopis";

export const getPerformanceDetail = async (
  performanceId: string,
): Promise<PerformanceDetail> => {
  const parsedData = await kopisFetcher(
    `${API_URL}/pblprfr/${performanceId}?service=${SERVICE_KEY}`,
  );

  const result = removeTextProperty(
    parsedData.dbs.db,
  ) as unknown as PerformanceDetail;

  return result;
};
