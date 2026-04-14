import { DetailPerformance } from "@classic-hub/shared/types/client";
import { API_URL, SERVICE_KEY } from "@/infrastructure/external-api/kopis";
import { kopisFetcher } from "@/application/services/kopisFetcher";
import { removeTextProperty } from "@/application/services/kopisPreprocessor";

export const getPerformanceDetail = async (
  performanceId: string,
): Promise<DetailPerformance> => {
  const parsedData = await kopisFetcher(
    `${API_URL}/pblprfr/${performanceId}?service=${SERVICE_KEY}`,
  );

  const result = removeTextProperty(
    parsedData.dbs.db,
  ) as unknown as DetailPerformance;

  return result;
};
