import { API_URL, SERVICE_KEY } from "@/infrastructure/kopis/client";
import { kopisFetcher } from "@/infrastructure/kopis/fetcher";
import { removeTextProperty } from "@/infrastructure/kopis/preprocessor";
import { IKopisService } from "@/infrastructure/kopis/service";
import { PerformanceDetail } from "@/shared/types/kopis";

export const createGetPerformanceDetail = async (
  kopisService: IKopisService
) => {
  return async (performanceId: string) => {
    return await kopisService.getPerformanceDetail(performanceId);
  }
};
