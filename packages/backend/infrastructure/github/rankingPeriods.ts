import dayjs, { Dayjs } from "dayjs";

export type RankingPeriod = "daily" | "weekly" | "monthly";

export interface RankingPeriodRange {
  period: RankingPeriod;
  startDate: string;
  endDate: string;
}

// 랭킹 집계 기간 산출. 기준일은 어제다 (KOPIS 박스오피스는 당일 집계를 제공하지 않는다).
// daily = 어제 하루, weekly = 어제까지 7일, monthly = 어제까지 30일.
// 순수 함수로 분리해 날짜 경계(월말 등)를 테스트 가능하게 한다.
export const getRankingPeriodRanges = (basis: Dayjs): RankingPeriodRange[] => {
  const endDate = basis.format("YYYYMMDD");
  return [
    { period: "daily", startDate: endDate, endDate },
    { period: "weekly", startDate: basis.subtract(6, "day").format("YYYYMMDD"), endDate },
    { period: "monthly", startDate: basis.subtract(29, "day").format("YYYYMMDD"), endDate },
  ];
};
