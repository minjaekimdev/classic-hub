import { Ranking } from "@/shared/types/kopis";
import { IKopisService } from "@/infrastructure/kopis/service";

// 실패 시 에러를 그대로 던지며, 폴백 정책은 호출자(경계 계층)가 담당한다.
export const createGetRanking = (kopisService: IKopisService) => {
  return async (startDate: string, endDate: string): Promise<Ranking[]> => {
    return kopisService.getRanking(startDate, endDate);
  };
};
