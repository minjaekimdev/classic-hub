/**
 * specs/home.md 구현 정책
 * - search-001: 검색 input placeholder 자리에 실제 검색 가능한 예시를 롤링 표시(SearchBar)
 * - search-008: 커밋된 검색어를 ConcertCard에 전달(일치 곡 메인 표시용)
 * - search-009: 검색어 입력 후 '검색' 버튼 제출 시에만 검색 수행(입력은 버퍼)
 * - view-001/002: 보기 모드 토글(데스크톱 전용) 및 URL 상태 반영
 * - view-003: 모바일에서는 보기 모드와 무관하게 앨범형 구조로 표시
 * - pagenation-001: 페이지 클릭(이동) 시 scrollTop: 0으로 스크롤 보정
 * - exception-02: 존재하지 않는 페이지 요청(?page=99999)은 마지막 페이지로 clamp
 * - exception-03: 조건에 맞는 공연이 없을 때 no-result ui 분기
 * - head-001: 탐색 가능 기간 안내는 히어로 notes로 표기한다(specs 갱신 전 임시 — 헤더 pill은 제거됨)
 *   (디자인: prototype/홈페이지 수정안 — 검색어·관람 기간 2필드 패널형 통합, DESIGN.md 미결 사항 1 확정)
 */
"use client";

import { useEffect, useRef } from "react";
import posthog from "posthog-js";
import Icon from "@/components/Icon";
import useHomePageState from "@/home/useHomePageState";
import ConcertCard from "@/home/components/ConcertCard";
import ConcertCardAlbum from "@/home/components/ConcertCardAlbum";
import DateRangePicker from "@/home/components/DateRangePicker";
import ErrorState from "@/home/components/ErrorState";
import NoResult from "@/home/components/NoResult";
import Pagination from "@/home/components/Pagination";
import SearchBar from "@/home/components/SearchBar";
import SortSelect from "@/home/components/SortSelect";
import StatusTabs from "@/home/components/StatusTabs";
import ViewModeToggle from "@/home/components/ViewModeToggle";
import useConcerts, { useConcertStatusCounts } from "@/queries/useConcerts";
import useIsDesktop from "@/lib/useIsDesktop";
import { BROWSABLE_MONTHS, getBrowsablePeriod } from "@/lib/period";
import { toDotDate } from "@/lib/date";

function ConcertCardSkeleton() {
  return (
    <article className="min-w-0 overflow-hidden rounded-md border border-outline-variant bg-surface-bright">
      <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-[240px_1fr] lg:gap-6">
        <div className="h-80 w-full animate-pulse rounded-sm bg-surface-container lg:w-[320px]" />
        <div className="flex flex-col gap-3">
          <div className="h-6 w-2/3 animate-pulse rounded-sm bg-surface-container" />
          <div className="h-4 w-1/3 animate-pulse rounded-sm bg-surface-container" />
          <div className="h-28 w-full animate-pulse rounded-sm bg-surface-container" />
        </div>
      </div>
    </article>
  );
}

export default function HomePage() {
  const { state, actions } = useHomePageState();
  const { queryInput, query, statusFilter, dateRange, sortBy, page, viewMode } = state;
  const {
    onQueryInputChange,
    onQuerySubmit,
    onStatusFilterChange,
    onDateRangeChange,
    onSortByChange,
    onViewModeChange,
    onPageChange,
    onResetFilters,
  } = actions;
  // 모바일(md 미만)에서는 보기 모드와 무관하게 앨범형 구조로 표시한다 (view-003)
  const isDesktop = useIsDesktop();
  const isAlbumView = isDesktop && viewMode === "album";

  const browsablePeriod = getBrowsablePeriod();

  const { data, isPending, isError, error, refetch, isPlaceholderData } = useConcerts({
    query,
    statusFilter,
    dateRange,
    sortBy,
    page,
  });
  const { data: statusCounts } = useConcertStatusCounts({ query, dateRange });

  // 목록 조회 실패는 사용자에게 ErrorState로 보이므로, 운영 가시성을 위해 에러를 수집한다
  useEffect(() => {
    if (error) {
      posthog.captureException(error);
    }
  }, [error]);

  // 검색 1회당 1건 수집 — resultCount는 응답 도착 시점에만 알 수 있어 여기서 수집한다
  // (0건 검색어 = 수요는 있는데 데이터가 없는 항목 → 데이터 확장 방향 지표)
  const capturedSearchQuery = useRef<string | null>(null);
  useEffect(() => {
    if (isPending || !data || !query.trim()) return;
    if (capturedSearchQuery.current === query) return;
    capturedSearchQuery.current = query;
    posthog.capture("search", { query, resultCount: data.total });
  }, [data, isPending, query]);

  // ?page=99999 처럼 존재하지 않는 페이지 요청은 마지막 페이지로 clamp (exception-02)
  useEffect(() => {
    if (data && page > data.totalPages) {
      onPageChange(data.totalPages);
    }
  }, [data, page, onPageChange]);

  // 페이지 이동 시 목록 최상단부터 볼 수 있도록 스크롤 초기화 (최초 렌더 제외)
  const isInitialPageRender = useRef(true);
  useEffect(() => {
    if (isInitialPageRender.current) {
      isInitialPageRender.current = false;
      return;
    }
    window.scrollTo(0, 0);
  }, [page]);

  // 검색 버튼 제출 — 버퍼(queryInput)를 커밋한다 (specs search-009)
  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onQuerySubmit(queryInput);
  };

  return (
    <>
      {/* 히어로 (navy 그라데이션) + 검색 패널 — 검색어·관람 기간 2필드 패널형 통합 */}
      <section className="hero-surface text-white">
        <div className="mx-auto w-full max-w-[1200px] px-6 pt-[54px]">
          <h1 className="font-serif text-[27px] font-bold leading-[1.32] tracking-[-0.02em] md:text-[36px]">
            프로그램과 연주곡으로 찾는
            <br />
            <span className="text-secondary">클래식</span> 콘서트
          </h1>
          <p className="mt-2.5 text-[15px] font-normal text-[#aab3c6]">
            작곡가, 작품명, 연주자, 공연장으로 엄선된 실황 공연을 탐색하세요.
          </p>
          <div className="mt-3.5 flex flex-wrap gap-x-[22px] gap-y-1.5">
            <span className="inline-flex items-center gap-1.5 text-[12.5px] text-[#8b96ad]">
              <Icon name="calendar_today" size={13} className="text-secondary" />
              <span>
                현재 {toDotDate(browsablePeriod.start)} ~ {toDotDate(browsablePeriod.end)} (향후{" "}
                {BROWSABLE_MONTHS}개월) 데이터 탐색 가능
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-[12.5px] text-[#8b96ad]">
              <Icon name="info" size={13} className="text-secondary" />
              <span>프로그램 정보는 AI로 추출되어 실제 공연 정보와 다를 수 있습니다.</span>
            </span>
          </div>

          {/* 검색 패널: 검색어 + 관람 기간 + 검색 (DESIGN.md 미결 사항 1 확정) */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-[34px] flex flex-col gap-3 rounded-t-[18px] bg-white pt-6 px-[26px] pb-5 shadow-[0_-18px_60px_-12px_rgba(6,12,26,0.35)] md:flex-row md:items-stretch md:gap-3"
          >
            <div className="min-w-0 flex-[1.6]">
              <SearchBar
                value={queryInput}
                onChange={onQueryInputChange}
                onClear={() => onQuerySubmit("")}
              />
            </div>
            <div className="flex-1">
              <DateRangePicker value={dateRange} onChange={onDateRangeChange} />
            </div>
            <button
              type="submit"
              className="flex w-full min-h-[63px] flex-none items-center justify-center gap-2 rounded-xl bg-primary text-base font-bold tracking-[0.02em] text-white transition-colors hover:bg-secondary hover:text-[#0d1728] md:w-32 md:min-h-0"
            >
              <Icon name="search" size={17} />
              <span>검색</span>
            </button>
          </form>
        </div>
      </section>

      {/* 툴바: 공연 상태 탭 + 보기 모드 + 정렬 */}
      <section className="border-b border-outline-variant bg-white">
        <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-4 px-6 py-[13px]">
          <StatusTabs value={statusFilter} onChange={onStatusFilterChange} counts={statusCounts} />
          <div className="flex items-center gap-3.5">
            <ViewModeToggle value={viewMode} onChange={onViewModeChange} />
            <SortSelect value={sortBy} onChange={onSortByChange} />
          </div>
        </div>
      </section>

      {/* 검색 결과 */}
      <section className="mx-auto w-full max-w-[1200px] px-6 py-[34px] pb-[70px]">
        <div className="mb-[22px] flex flex-wrap items-baseline gap-2 border-b border-outline-variant pb-3.5">
          <span className="font-serif text-[19px] font-semibold text-primary">검색 결과:</span>
          {query.length > 0 && (
            <span className="font-serif text-[19px] font-bold text-primary">‘{query}’</span>
          )}
          {data && (
            <span className="text-[13.5px] text-on-surface-variant">
              (총 {data.total.toLocaleString()}건)
            </span>
          )}
        </div>

        {isPending ? (
          <div className="space-y-6">
            <ConcertCardSkeleton />
            <ConcertCardSkeleton />
            <ConcertCardSkeleton />
          </div>
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : data && data.items.length === 0 ? (
          <NoResult onResetFilters={onResetFilters} />
        ) : (
          data && (
            <>
              {/* 페이지 이동 중 이전 데이터를 흐리게 표시 (placeholderData) */}
              <div
                className={`transition-opacity ${isPlaceholderData ? "pointer-events-none opacity-50" : ""}`}
              >
                {isAlbumView ? (
                  /* 앨범형: 포스터 중심 카드 그리드 (view-001) */
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
                    {data.items.map((concert) => (
                      <ConcertCardAlbum key={concert.id} concert={concert} searchQuery={query} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-[22px]">
                    {data.items.map((concert) => (
                      <ConcertCard key={concert.id} concert={concert} searchQuery={query} />
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-12">
                <Pagination
                  page={page}
                  totalPages={data.totalPages}
                  onPageChange={onPageChange}
                />
              </div>
            </>
          )
        )}
      </section>
    </>
  );
}
