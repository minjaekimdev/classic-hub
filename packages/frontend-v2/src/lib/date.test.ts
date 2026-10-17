import { describe, expect, it } from "vitest";
import {
  clampISODate,
  formatPeriodRange,
  normalizeDateRange,
  toDisplayDate,
} from "@/lib/date";

describe("formatPeriodRange (specs card-004)", () => {
  it("공연 기간은 첫째 줄 형식으로 시작일(전체)+종료일(월.일)을 표기한다", () => {
    expect(formatPeriodRange("2025-04-18", "2025-04-19")).toBe(
      "2025.04.18 (금) ~ 04.19 (토)",
    );
  });

  it("당일 공연은 ~ 없이 하나의 날짜만 표기한다", () => {
    expect(formatPeriodRange("2025-05-23", "2025-05-23")).toBe("2025.05.23 (금)");
  });

  it("연도가 바뀌는 기간은 종료일에 연도를 포함한다", () => {
    expect(formatPeriodRange("2025-12-31", "2026-01-01")).toBe(
      "2025.12.31 (수) ~ 2026.01.01 (목)",
    );
  });

  it("DB 점 표기(YYYY.MM.DD) 입력도 처리한다", () => {
    expect(formatPeriodRange("2025.04.18", "2025.04.19")).toBe(
      "2025.04.18 (금) ~ 04.19 (토)",
    );
  });
});

describe("normalizeDateRange (specs exception-02)", () => {
  const bounds = { start: "2026-10-16", end: "2027-01-16" };

  it("유효 범위를 벗어난 날짜는 유효 범위로 clamp한다", () => {
    expect(normalizeDateRange("2020-01-01", "2030-12-31", bounds)).toEqual(bounds);
  });

  it("from이 to보다 뒤이면 두 날짜를 맞바꾼다", () => {
    expect(normalizeDateRange("2026-11-30", "2026-11-01", bounds)).toEqual({
      start: "2026-11-01",
      end: "2026-11-30",
    });
  });

  it("파라미터가 비어 있으면 탐색 가능한 전체 기간을 사용한다", () => {
    expect(normalizeDateRange("", "", bounds)).toEqual(bounds);
  });
});

describe("clampISODate", () => {
  it("최소값보다 이전이면 최소값을 반환한다", () => {
    expect(clampISODate("2026-09-01", "2026-10-16", "2027-01-16")).toBe("2026-10-16");
  });

  it("최대값보다 이후면 최대값을 반환한다", () => {
    expect(clampISODate("2027-06-01", "2026-10-16", "2027-01-16")).toBe("2027-01-16");
  });
});

describe("toDisplayDate", () => {
  it("트리거 버튼 표기(2025. 04. 01) 형식으로 변환한다", () => {
    expect(toDisplayDate("2025-04-01")).toBe("2025. 04. 01");
  });
});
