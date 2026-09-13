import { describe, it, expect } from "vitest";
import dayjs from "dayjs";
import { DATE_POLICY, DatePolicy, UPDATE_LOOKBACK_DAYS } from "./datePolicy";
import { buildSyncDateRange } from "./syncDateRange";

// 테스트는 두 층으로 나뉜다.
// 1) 계약 테스트: afterDate(어제)는 정책이 아니라 계약이므로 리터럴로 고정해
//    의도하지 않은 변경 시 커밋 시점에 깨진다.
// 2) 파생 테스트: 정책 날짜(랭킹/예매 윈도)는 DATE_POLICY를 참조해 검증하므로
//    정책 변경 시 테스트 수정이 필요 없다.
describe("afterDate 과금 방지 계약 (어제 고정)", () => {
  // 크론이 매일 도는 전제에서 수정분 조회는 반드시 어제여야 한다.
  // 과거 이 값이 32일이 되어 하루 ~1,000건의 유료 API 과금 사고가 발생한 이력이 있다.
  it("수정분 조회 범위는 반드시 1일이어야 한다", () => {
    expect(UPDATE_LOOKBACK_DAYS).toBe(1);
  });

  it("afterDate는 반드시 어제(오늘 - 1일)여야 한다", () => {
    const { afterDate } = buildSyncDateRange(dayjs("2026-09-13"));

    expect(afterDate).toBe("20260912");
  });

  it("월 경계에서도 afterDate를 정확히 계산한다 (윤년 아님)", () => {
    const { afterDate } = buildSyncDateRange(dayjs("2026-03-01"));

    expect(afterDate).toBe("20260228");
  });

  it("연도 경계에서도 afterDate를 정확히 계산한다", () => {
    const { afterDate } = buildSyncDateRange(dayjs("2027-01-01"));

    expect(afterDate).toBe("20261231");
  });
});

describe("정책 날짜 파생 테스트 (정책 변경 시 수정 불필요)", () => {
  it("주입한 정책 값에 따라 랭킹/예매 윈도를 파생한다", () => {
    const today = dayjs("2026-09-13");
    const policy: DatePolicy = {
      rankingWindowDays: 45,
      futureWindowDays: 120,
    };

    const range = buildSyncDateRange(today, policy);

    expect(range.startDate).toBe(
      today.subtract(45, "days").format("YYYYMMDD"),
    );
    expect(range.endDate).toBe(today.add(120, "days").format("YYYYMMDD"));
    expect(range.updateEndDate).toBe(
      today.add(119, "days").format("YYYYMMDD"),
    );
    expect(range.afterDate).toBe(
      today.subtract(UPDATE_LOOKBACK_DAYS, "days").format("YYYYMMDD"),
    );
  });

  it("기본 정책(DATE_POLICY)으로도 동일하게 파생된다", () => {
    const today = dayjs("2026-09-13");

    const range = buildSyncDateRange(today);

    expect(range.startDate).toBe(
      today
        .subtract(DATE_POLICY.rankingWindowDays, "days")
        .format("YYYYMMDD"),
    );
    expect(range.endDate).toBe(
      today.add(DATE_POLICY.futureWindowDays, "days").format("YYYYMMDD"),
    );
    expect(range.updateEndDate).toBe(
      today
        .add(DATE_POLICY.futureWindowDays - 1, "days")
        .format("YYYYMMDD"),
    );
  });
});

describe("불변식 (정책과 무관)", () => {
  it("모든 날짜는 KOPIS API 파라미터 형식(YYYYMMDD)을 따른다", () => {
    const range = buildSyncDateRange(dayjs("2026-09-13"));

    for (const value of Object.values(range)) {
      expect(value).toMatch(/^\d{8}$/);
    }
  });

  it("afterDate < updateEndDate < endDate 관계가 항상 성립한다", () => {
    const range = buildSyncDateRange(dayjs("2026-09-13"));

    expect(dayjs(range.afterDate).isBefore(dayjs(range.updateEndDate))).toBe(
      true,
    );
    expect(dayjs(range.updateEndDate).isBefore(dayjs(range.endDate))).toBe(
      true,
    );
  });
});
