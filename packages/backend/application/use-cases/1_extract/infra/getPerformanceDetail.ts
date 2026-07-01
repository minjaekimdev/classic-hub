import { IKopisService } from "@/infrastructure/kopis/service";

export const createGetPerformanceDetail = async (
  kopisService: IKopisService
) => {
  return async (performanceId: string) => {
    return kopisService.getPerformanceDetail(performanceId);
  }
};
