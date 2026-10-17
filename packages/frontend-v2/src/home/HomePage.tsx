/**
 * specs/home.md 구현 정책
 * - search-008: 커밋된 검색어를 ConcertCard에 전달(일치 곡 메인 표시용)
 * - pagenation-001: 페이지 클릭(이동) 시 scrollTop: 0으로 스크롤 보정
 * - exception-02: 존재하지 않는 페이지 요청(?page=99999)은 마지막 페이지로 clamp
 * - exception-03: 조건에 맞는 공연이 없을 때 no-result ui 분기
 */
"use client";

import { useEffect, useRef } from "react";
import posthog from "posthog-js";
import Icon from "@/components/Icon";
import useHomePageState from "@/home/useHomePageState";
import ConcertCard from "@/home/components/ConcertCard";
import DateRangePicker from "@/home/components/DateRangePicker";
import ErrorState from "@/home/components/ErrorState";
import NoResult from "@/home/components/NoResult";
import Pagination from "@/home/components/Pagination";
import SearchBar from "@/home/components/SearchBar";
import SortSelect from "@/home/components/SortSelect";
import StatusTabs from "@/home/components/StatusTabs";
import useConcerts, { useConcertStatusCounts } from "@/queries/useConcerts";

function ConcertCardSkeleton() {
  return (
    <article className="overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest shadow-sm md:rounded-none md:shadow-none">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="p-3 lg:col-span-3 lg:p-6">
          <div className="h-80 w-full animate-pulse bg-surface-container lg:aspect-[3/4] lg:h-auto" />
        </div>
        <div className="flex flex-col gap-3 p-4 lg:col-span-9 lg:p-8">
          <div className="h-6 w-2/3 animate-pulse bg-surface-container" />
          <div className="h-4 w-1/3 animate-pulse bg-surface-container" />
          <div className="h-28 w-full animate-pulse bg-surface-container" />
        </div>
      </div>
    </article>
  );
}

export default function HomePage() {
  const { state, actions } = useHomePageState();
  const { queryInput, query, statusFilter, dateRange, sortBy, page } = state;
  const {
    onQueryInputChange,
    onQuerySubmit,
    onStatusFilterChange,
    onDateRangeChange,
    onSortByChange,
    onPageChange,
    onResetFilters,
  } = actions;

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

  return (
    <>
      {/* 히어로 + 검색 */}
      <section className="border-b border-outline-variant bg-surface-bright px-4 py-8 md:px-8 md:py-12">
        <div className="mx-auto mb-8 max-w-4xl text-left md:text-center">
          <div className="mb-3 inline-flex items-center gap-2">
            <span className="hidden h-px w-6 bg-secondary md:inline-block" />
            <span className="font-label-caps uppercase tracking-widest text-secondary">
              Classical Music Repertoire Index
            </span>
            <span className="hidden h-px w-6 bg-secondary md:inline-block" />
          </div>
          <h1 className="font-serif text-headline-lg-mobile tracking-tight text-primary md:text-headline-lg">
            프로그램과 연주곡으로 찾는
            <br className="md:hidden" /> 클래식 콘서트
          </h1>
          <p className="mt-2 max-w-xl text-body-sm text-on-surface-variant md:mx-auto md:text-body-md">
            작곡가, 작품명, 연주자 등으로 엄선된 실황 공연을 탐색하세요.
          </p>
          <p className="mt-1.5 flex items-center gap-1.5 text-body-sm text-outline md:justify-center">
            <Icon name="auto_awesome" size={13} className="shrink-0 text-secondary" />
            <span>프로그램 정보는 AI로 추출되어 실제 공연 정보와 다를 수 있습니다.</span>
          </p>
        </div>
        <div className="mx-auto max-w-[840px]">
          <SearchBar value={queryInput} onChange={onQueryInputChange} onSubmit={onQuerySubmit} />
        </div>
      </section>

      {/* 상태 필터 + 공연 기간 */}
      <section className="border-b border-outline-variant bg-surface-container-lowest">
        <div className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-3 px-4 py-3.5 md:flex-row md:items-center md:px-8">
          <StatusTabs value={statusFilter} onChange={onStatusFilterChange} counts={statusCounts} />
          <DateRangePicker value={dateRange} onChange={onDateRangeChange} />
        </div>
      </section>

      {/* 검색 결과 */}
      <section className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-10">
        <div className="mb-6 flex flex-col justify-between gap-3 border-b border-outline-variant pb-4 md:mb-8 sm:flex-row sm:items-baseline">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="font-serif text-headline-sm text-primary">검색 결과:</span>
            {query.length > 0 && (
              <span className="font-serif font-semibold text-headline-sm text-primary">
                ‘{query}’
              </span>
            )}
            {data && (
              <span className="ml-1 text-body-md text-on-surface-variant">
                (총 {data.total.toLocaleString()}건)
              </span>
            )}
          </div>
          <SortSelect value={sortBy} onChange={onSortByChange} />
        </div>

        {isPending ? (
          <div className="space-y-6 lg:space-y-8">
            <ConcertCardSkeleton />
            <ConcertCardSkeleton />
            <ConcertCardSkeleton />
          </div>
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : data && data.items.length === 0 ? (
          <NoResult
            query={query}
            dateRange={dateRange}
            onResetFilters={onResetFilters}
            onSearchExample={onQuerySubmit}
          />
        ) : (
          data && (
            <>
              {/* 페이지 이동 중 이전 데이터를 흐리게 표시 (placeholderData) */}
              <div
                className={`space-y-6 transition-opacity lg:space-y-8 ${
                  isPlaceholderData ? "pointer-events-none opacity-50" : ""
                }`}
              >
                {data.items.map((concert) => (
                  <ConcertCard key={concert.id} concert={concert} searchQuery={query} />
                ))}
              </div>
              <div className="mt-12">
                <Pagination
                  page={page}
                  totalPages={data.totalPages}
                  total={data.total}
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
