import { withErrorHandling } from "@/shared/utils/error";
import { Ranking } from "@/shared/types/kopis";
import { IKopisService } from "@/infrastructure/kopis/service";

export const createGetRanking = (kopisService: IKopisService) => {
  return async (
    startDate: string,
    endDate: string,
  ): Promise<Ranking[] | null> => {
    return withErrorHandling(
      async () => {
        return await kopisService.getRanking(startDate, endDate);
      },
      null,
      "kopis",
    );
  };
};
