import { API_URL, SERVICE_KEY } from "@/infrastructure/kopis/client";
import { kopisFetcher } from "@/infrastructure/kopis/fetcher";
import { removeTextProperty } from "@/infrastructure/kopis/preprocessor";
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
