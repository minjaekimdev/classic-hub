/**
 * specs/home.md 구현 정책
 * - search-005: 새로고침으로 탐색 가능한 최대 기간 적용(DateRangePicker에서 위임)
 * - search-007: '검색 필터 초기화' 시 검색어/공연상태/공연기간/정렬기준 전체 초기화
 * - exception-02: URL 기간 파라미터가 유효 범위를 벗어나도 유효 범위로 정규화
 * - exception-04: 검색 요청 500ms 디바운싱
 */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryStates } from "nuqs";
import { normalizeDateRange } from "@/lib/date";
import { getBrowsablePeriod } from "@/lib/period";
import { homePageUrlParsers } from "@/lib/urlState";
import type { DateRange, SortBy, StatusFilter } from "@/types/concert";

/** 검색 요청 디바운스 (exception-04: 429 예방) */
const SEARCH_DEBOUNCE_MS = 500;

export default function useHomePageState() {
  const [{ q, status, from, to, sort, page }, setParams] = useQueryStates(homePageUrlParsers);

  const browsablePeriod = getBrowsablePeriod();
  /** URL의 from/to가 비었거나 유효 범위를 벗어나도 유효 범위로 정규화한다 (exception-02) */
  const dateRange = normalizeDateRange(from, to, browsablePeriod);

  // 검색어 입력 버퍼(즉시 표기용). 커밋된 검색어는 URL(q)이 유일하게 소유한다.
  const [queryInput, setQueryInput] = useState(q);
  useEffect(() => {
    setQueryInput(q);
  }, [q]);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearDebounce = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
  };
  useEffect(() => clearDebounce, []);

  /** 검색어 즉시 커밋 (Enter / 검색 버튼 / 초기화 / 예시 검색어) */
  const commitQuery = useCallback(
    (value: string) => {
      clearDebounce();
      setQueryInput(value);
      setParams({ q: value, page: 1 });
    },
    [setParams],
  );

  /** 입력 중에는 버퍼만 갱신하고, 500ms 후 URL에 커밋한다 */
  const handleQueryInput = useCallback(
    (value: string) => {
      setQueryInput(value);
      clearDebounce();
      if (!value.trim()) {
        setParams({ q: "", page: 1 });
        return;
      }
      debounceRef.current = setTimeout(() => {
        setParams({ q: value, page: 1 });
      }, SEARCH_DEBOUNCE_MS);
    },
    [setParams],
  );

  const handleStatusFilter = useCallback(
    (value: StatusFilter) => {
      setParams({ status: value, page: 1 });
    },
    [setParams],
  );

  /** 새로고침 버튼으로 탐색 가능한 최대 기간 적용 (search-005) — DateRangePicker가 onChange로 위임 */
  const handleDateRange = useCallback(
    (value: DateRange) => {
      setParams({ from: value.start, to: value.end, page: 1 });
    },
    [setParams],
  );

  const handleSortBy = useCallback(
    (value: SortBy) => {
      setParams({ sort: value, page: 1 });
    },
    [setParams],
  );

  const handlePage = useCallback(
    (value: number) => {
      setParams({ page: value });
    },
    [setParams],
  );

  /** 검색 필터 초기화 (search-007) */
  const handleResetFilters = useCallback(() => {
    const period = getBrowsablePeriod();
    clearDebounce();
    setQueryInput("");
    setParams({
      q: "",
      status: "all",
      from: period.start,
      to: period.end,
      sort: "imminent",
      page: 1,
    });
  }, [setParams]);

  return {
    state: {
      queryInput,
      query: q,
      statusFilter: status,
      dateRange,
      sortBy: sort,
      page,
      browsablePeriod,
    },
    actions: {
      onQueryInputChange: handleQueryInput,
      onQuerySubmit: commitQuery,
      onStatusFilterChange: handleStatusFilter,
      onDateRangeChange: handleDateRange,
      onSortByChange: handleSortBy,
      onPageChange: handlePage,
      onResetFilters: handleResetFilters,
    },
  };
}
