/**
 * specs/home.md 구현 정책
 * - card-004: formatPeriodRange — 공연 날짜 표기, 당일 공연은 단일 날짜
 * - exception-02: normalizeDateRange — 범위를 벗어난/뒤집힌 기간 파라미터 clamp
 */
import type { DateRange } from "@/types/concert";

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"] as const;
const MONTH_LABELS_EN = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
] as const;

export const weekdayLabel = (date: Date): string => WEEKDAY_LABELS[date.getDay()];

export const monthLabelEn = (date: Date): string => MONTH_LABELS_EN[date.getMonth()];

export const toISODate = (date: Date): string => {
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/** "YYYY-MM-DD", "YYYY.MM.DD" 모두 파싱 (DB 값은 점 표기) */
export const parseISODate = (value: string): Date => {
  const [year, month, day] = value.replace(/\./g, "-").split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const todayISO = (): string => toISODate(new Date());

/** 데이터 조회용 표기("YYYY.MM.DD") */
export const toDotDate = (iso: string): string => iso.replaceAll("-", ".");

/** 트리거 버튼 표기("2025. 04. 01") */
export const toDisplayDate = (iso: string): string => {
  const [year, month, day] = iso.split("-");
  return `${year}. ${month}. ${day}`;
};

export const addMonths = (iso: string, months: number): string => {
  const date = parseISODate(iso);
  const target = new Date(date.getFullYear(), date.getMonth() + months, date.getDate());
  return toISODate(target);
};

/** "2025.04.18 (금)" */
export const formatDateWithWeekday = (iso: string): string =>
  `${toDotDate(iso)} (${weekdayLabel(parseISODate(iso))})`;

/**
 * 공연 기간 표기 (card-004)
 * - 기간: "2025.04.18 (금) ~ 04.19 (토)" (같은 해일 때 종료 연도 생략)
 * - 당일 공연: "2025.04.18 (금)" (단일 날짜)
 */
export const formatPeriodRange = (from: string, to: string): string => {
  const start = formatDateWithWeekday(from);
  if (from === to) return start;
  const sameYear = from.slice(0, 4) === to.slice(0, 4);
  const endDot = toDotDate(to);
  const endShort = sameYear ? endDot.slice(5) : endDot;
  return `${start} ~ ${endShort} (${weekdayLabel(parseISODate(to))})`;
};

export const clampISODate = (iso: string, min: string, max: string): string => {
  if (iso < min) return min;
  if (iso > max) return max;
  return iso;
};

/** from > to 가 뒤집힌 범위와 유효 범위 밖의 날짜를 정규화한다. 비어있으면 기본 기간을 사용한다 */
export const normalizeDateRange = (
  from: string,
  to: string,
  bounds: DateRange,
): DateRange => {
  const clampedFrom = from ? clampISODate(from, bounds.start, bounds.end) : bounds.start;
  const clampedTo = to ? clampISODate(to, bounds.start, bounds.end) : bounds.end;
  return clampedFrom <= clampedTo
    ? { start: clampedFrom, end: clampedTo }
    : { start: clampedTo, end: clampedFrom };
};
