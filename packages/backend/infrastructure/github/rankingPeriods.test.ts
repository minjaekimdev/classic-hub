import { describe, it, expect } from "vitest";
import dayjs from "dayjs";
import { getRankingPeriodRanges } from "./rankingPeriods";

describe("getRankingPeriodRanges", () => {
  it("기준일 기준 daily/weekly/monthly 기간을 산출한다", () => {
    const ranges = getRankingPeriodRanges(dayjs("2026-09-06"));

    expect(ranges).toEqual([
      { period: "daily", startDate: "20260906", endDate: "20260906" },
      { period: "weekly", startDate: "20260831", endDate: "20260906" },
      { period: "monthly", startDate: "20260808", endDate: "20260906" },
    ]);
  });

  it("월 경계를 가로지르는 기간에서도 이전 달 날짜가 올바르게 계산된다", () => {
    const ranges = getRankingPeriodRanges(dayjs("2026-09-01"));

    expect(ranges[0].startDate).toBe("20260901");
    expect(ranges[1].startDate).toBe("20260826");
    expect(ranges[2].startDate).toBe("20260803");
  });

  it("연 경계를 가로지르는 기간에서도 이전 연도로 넘어간다", () => {
    const ranges = getRankingPeriodRanges(dayjs("2026-01-01"));

    expect(ranges[1].startDate).toBe("20251226");
    expect(ranges[2].startDate).toBe("20251203");
  });
});
