/**
 * specs/home.md 구현 정책
 * - head-001: 헤더에 표기되는 향후 탐색 가능 기간 정의 (BROWSABLE_MONTHS)
 * - search-005: 새로고침 시 초기화되는 '탐색 가능한 최대 기간' 정의
 */
import { addMonths, todayISO } from "@/lib/date";
import type { DateRange } from "@/types/concert";

/** KOPIS 편성 데이터 기준 탐색 가능 기간 (개월) */
export const BROWSABLE_MONTHS = 3;

/** 탐색 가능한 최대 기간: 오늘 ~ 3개월 후 */
export const getBrowsablePeriod = (): DateRange => {
  const start = todayISO();
  return { start, end: addMonths(start, BROWSABLE_MONTHS) };
};
