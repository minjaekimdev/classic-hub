import { PerformanceDetail } from "shared/types/kopis";
import { withErrorHandling } from "shared/utils/error";
import { API_URL, SERVICE_KEY } from "@/infrastructure/external-api/kopis";
import { kopisFetcher } from "@/application/services/kopisFetcher";
import { removeTextProperty } from "@/application/services/kopisPreprocessor";

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
