import dayjs, { Dayjs } from "dayjs";
import { DATE_POLICY, DatePolicy, UPDATE_LOOKBACK_DAYS } from "./datePolicy";

// 크론이 syncPerformanceData에 전달할 4개의 날짜 파라미터.
export interface SyncDateRange {
  startDate: string;
  endDate: string;
  afterDate: string;
  updateEndDate: string;
}

// updatePerformances 크론의 조회 날짜 범위를 계산한다.
// 모든 숫자의 출처는 datePolicy.ts이며, 파생 규칙은 다음과 같다.
// - startDate: 오늘 - DATE_POLICY.rankingWindowDays (월간 랭킹 집계)
// - endDate: 오늘 + DATE_POLICY.futureWindowDays (향후 예매 일정)
// - afterDate: 오늘 - UPDATE_LOOKBACK_DAYS (KOPIS 수정분 필터, 어제로 고정된 계약값)
// - updateEndDate: 오늘 + DATE_POLICY.futureWindowDays - 1
// 모든 값은 KOPIS API 파라미터 형식(YYYYMMDD)을 따른다.
// policy는 테스트 주입용이며, 호출부에서는 기본값 DATE_POLICY를 사용한다.
export const buildSyncDateRange = (
  today: Dayjs,
  policy: DatePolicy = DATE_POLICY,
): SyncDateRange => {
  return {
    startDate: today
      .subtract(policy.rankingWindowDays, "days")
      .format("YYYYMMDD"),
    endDate: today.add(policy.futureWindowDays, "days").format("YYYYMMDD"),
    afterDate: today
      .subtract(UPDATE_LOOKBACK_DAYS, "days")
      .format("YYYYMMDD"),
    updateEndDate: today
      .add(policy.futureWindowDays - 1, "days")
      .format("YYYYMMDD"),
  };
};
