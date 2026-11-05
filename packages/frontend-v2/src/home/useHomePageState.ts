/**
 * specs/home.md 구현 정책
 * - search-005: 새로고침으로 탐색 가능한 최대 기간 적용(DateRangePicker에서 위임)
 * - search-007: '검색 필터 초기화' 시 검색어/공연상태/공연기간/정렬기준 전체 초기화
 * - search-009: 검색어 입력 후 '검색' 제출 시에만 URL에 검색어 커밋
 * - view-001/002: 보기 모드 상태(기본값 리스트형)를 URL로 관리하고 전환은 히스토리에 기록하지 않음
 * - exception-02: URL 기간 파라미터가 유효 범위를 벗어나도 유효 범위로 정규화
 */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryStates } from "nuqs";
import { normalizeDateRange } from "@/lib/date";
import { getBrowsablePeriod } from "@/lib/period";
import { homePageUrlParsers } from "@/lib/urlState";
import type { DateRange, SortBy, StatusFilter, ViewMode } from "@/types/concert";

/** 검색 제출 디바운스 (search-009: 연타로 인한 중복 요청 예방) */
const SEARCH_DEBOUNCE_MS = 500;

export default function useHomePageState() {
  const [{ q, status, from, to, sort, page, view }, setParams] = useQueryStates(homePageUrlParsers);

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

  /** 검색 제출 커밋 (검색 버튼 / Enter / 입력 초기화 / 예시 검색어) — 500ms 디바운스 후 URL에 반영한다 */
  const submitQuery = useCallback(
    (value: string) => {
      setQueryInput(value);
      clearDebounce();
      debounceRef.current = setTimeout(() => {
        setParams({ q: value, page: 1 });
      }, SEARCH_DEBOUNCE_MS);
    },
    [setParams],
  );

  /** 입력 중에는 버퍼만 갱신하고, '검색' 제출 전에는 URL에 반영하지 않는다 (search-009) */
  const handleQueryInput = useCallback((value: string) => {
    setQueryInput(value);
  }, []);

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

  /** 보기 모드 변경 — 표시 방식 전환은 히스토리에 기록하지 않는다 (view-002) */
  const handleViewMode = useCallback(
    (value: ViewMode) => {
      setParams({ view: value }, { history: "replace" });
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
      viewMode: view,
      browsablePeriod,
    },
    actions: {
      onQueryInputChange: handleQueryInput,
      onQuerySubmit: submitQuery,
      onStatusFilterChange: handleStatusFilter,
      onDateRangeChange: handleDateRange,
      onSortByChange: handleSortBy,
      onViewModeChange: handleViewMode,
      onPageChange: handlePage,
      onResetFilters: handleResetFilters,
    },
  };
}
