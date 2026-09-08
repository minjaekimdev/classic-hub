import { IKopisService } from "@/infrastructure/kopis/service";

// KOPIS 서비스를 flow의 fetchPage 포트에 맞춰주는 어댑터.
// 실패 시 에러를 그대로 던지며, 재시도/알림 정책은 상위 flow(getAllPerformanceIdList)가 담당한다.
export const createGetPerformanceIdsInPage = (kopisService: IKopisService) => {
  return async (
    startDate: string,
    endDate: string,
    page: number,
    afterDate?: string,
  ): Promise<string[]> => {
    return kopisService.getPerformanceIdsInPage(
      startDate,
      endDate,
      page,
      afterDate,
    );
  };
};
