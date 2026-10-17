/**
 * specs/home.md 구현 정책
 * - search-004: 공연 상태별 개수 조회(StatusTabs 괄호 표기용)
 * - search-006: 목록 조회에 api/concerts.ts의 PAGE_SIZE 적용
 */
import { queryOptions, useQuery } from "@tanstack/react-query";
import {
  fetchConcertStatusCounts,
  fetchConcerts,
  PAGE_SIZE,
  type FetchConcertCountsParams,
  type FetchConcertsParams,
} from "@/api/concerts";

export const concertsQueryOptions = (params: FetchConcertsParams) =>
  queryOptions({
    queryKey: [
      "concerts",
      {
        query: params.query,
        statusFilter: params.statusFilter,
        dateRange: params.dateRange,
        sortBy: params.sortBy,
        page: params.page,
      },
    ] as const,
    queryFn: () => fetchConcerts({ ...params, pageSize: PAGE_SIZE }),
  });

export default function useConcerts(params: FetchConcertsParams) {
  return useQuery(concertsQueryOptions(params));
}

export function useConcertStatusCounts(params: FetchConcertCountsParams) {
  return useQuery({
    queryKey: ["concerts", "counts", { query: params.query, dateRange: params.dateRange }] as const,
    queryFn: () => fetchConcertStatusCounts(params),
  });
}
