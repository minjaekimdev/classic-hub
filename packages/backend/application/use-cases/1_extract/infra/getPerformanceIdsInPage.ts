import { IKopisService } from "@/infrastructure/kopis/service";
import { withErrorHandling } from "@/shared/utils/error";

export const createGetPerformanceIdsInPage = (kopisService: IKopisService) => {
  return async (
    startDate: string,
    endDate: string,
    page: number,
    afterDate?: string,
  ): Promise<string[]> => {
    return withErrorHandling(
      async () => {
        return await kopisService.getPerformanceIdsInPage(
          startDate,
          endDate,
          page,
          afterDate,
        );
      },
      null,
      "kopis",
    );
  };
};
