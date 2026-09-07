import { Ranking } from "@/shared/types/kopis";

// updateRanking이 의존하는 사이드 이펙트를 모두 주입받는다 (syncPerformances의 deps 패턴과 동일).
// 탑레벨 import가 없으므로 테스트에서 vi.mock 없이 결정적(deterministic)으로 검증할 수 있다.
export interface UpdateRankingDeps {
  // KOPIS 박스오피스 랭킹 조회. 데이터가 없으면 null을 반환하고, 네트워크 오류는 그대로 throw한다.
  getRanking: (startDate: string, endDate: string) => Promise<Ranking[] | null>;
  // DB에 랭킹 일괄 반영 (RPC bulk_update_concert_ranks)
  updateRanks: (period: string, payload: Ranking[]) => Promise<void>;
  log: {
    error: (msg: string, meta?: Record<string, unknown>) => void;
  };
  notify: (message: string) => Promise<unknown>;
}

export const createUpdateRanking = ({
  getRanking,
  updateRanks,
  log,
  notify,
}: UpdateRankingDeps) => {
  return async (
    period: string,
    startDate: string,
    endDate: string,
  ): Promise<void> => {
    const ranking = await getRanking(startDate, endDate);

    const dateRange = `${startDate} ~ ${endDate}`;
    if (!ranking) {
      log.error(`[FETCH_FAIL] ranking data fetch failed: ${dateRange}`, {
        service: "kopis",
      });
      await notify(`[FETCH_FAIL] ranking data fetch failed: ${dateRange}`);
      return;
    }

    // 적재 실패는 삼켜서 알림만 보낸다. daily/weekly/monthly가 순차 실행되므로
    // 한 period의 실패가 나머지 period 처리까지 죽이면 안 된다.
    try {
      await updateRanks(period, ranking);
    } catch (error) {
      log.error(
        `[UPDATE_FAILED] ${period} ranking data update failed: ${dateRange}`,
        { service: "supabase" },
      );
      await notify(
        `❌ [UPDATE_FAILED] ${period} ranking data update failed: ${dateRange}`,
      );
    }
  };
};
