import { kopisFetcher } from "@/application/services/kopis/kopisFetcher";
import { removeTextProperty } from "@/application/services/kopis/kopisPreprocessor";
import {
  API_URL,
  SERVICE_KEY,
  CLASSIC,
} from "@/infrastructure/external-api/kopis";
import { Ranking } from "shared/types/kopis";
import { withErrorHandling } from "shared/utils/error";

const getRanking = async (startDate: string, endDate: string) => {
  return withErrorHandling(
    async () => {
      const parsedData = await kopisFetcher(
        `${API_URL}/boxoffice?service=${SERVICE_KEY}&stdate=${startDate}&eddate=${endDate}&catecode=${CLASSIC}`,
      );

      const result = removeTextProperty(
        parsedData.boxofs.boxof,
      ) as unknown as Ranking[];

      return result;
    },
    null,
    "kopis",
  );
};

export default getRanking;
