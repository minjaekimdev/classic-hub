import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import type { Database } from "@classic-hub/shared/types/supabase";
import supabase from "@/app/api/supabase-client";
import type { SortType } from "@/features/filter/types/filter";
import { mapToPerformance } from "../mappers/home-performance-mapper";
import type { DBPerformance } from "@classic-hub/shared/types/database";
import type { PerformanceSummary } from "@classic-hub/shared/types/client";

type PerformanceRow = Database["public"]["Tables"]["performances"]["Row"];

type PerformanceQuery = PostgrestFilterBuilder<
  Database["__InternalSupabase"],
  Database["public"],
  PerformanceRow,
  PerformanceRow[],
  string,
  unknown,
  unknown
>;

interface SearchFilters {
  keyword: string | null;
  location: string | null;
  minPrice: string | null;
  maxPrice: string | null;
  startDate: string | null;
  endDate: string | null;
  sortBy: SortType;
  selectedVenues: string[];
}

const getLocationQuery = (query: PerformanceQuery, location: string) => {
  if (location === "충북") {
    return query.in("area", ["충북", "충청북도"]);
  }
  if (location === "충남") {
    return query.in("area", ["충남", "충청남도"]);
  }
  if (location === "전북") {
    return query.in("area", ["전북", "전라북도", "전북특별자치도"]);
  }
  if (location === "전남") {
    return query.in("area", ["전남", "전라남도"]);
  }
  if (location === "경북") {
    return query.in("area", ["경북", "경상북도"]);
  }
  if (location === "경남") {
    return query.in("area", ["경남", "경상남도"]);
  }
  if (location === "제주") {
    return query.in("area", ["제주", "제주특별자치도"]);
  }
  return query.ilike("area", `%${location}%`);
};

export const fetchSearchResults = async (
  filters: SearchFilters,
): Promise<PerformanceSummary[]> => {
  // 1. 기본 쿼리 시작
  let query = supabase.from("performances").select("*");

  // 2. 동적 필터링 (값이 존재할 때만 체이닝)

  if (filters.keyword) {
    // 제목(title) 혹은 장소명(venue) 등 원하는 컬럼 지정
    query = query.or(
      `performance_name.ilike.%${filters.keyword}%, cast.ilike.%${filters.keyword}%`,
    );
  }

  // 지역
  if (filters.location) {
    query = getLocationQuery(query, filters.location);
  }

  // 가격 범위
  if (filters.minPrice) {
    query = query.gte("max_price", filters.minPrice);
    if (filters.maxPrice) {
      console.log(filters.maxPrice);
      query = query.lte("min_price", filters.maxPrice);
    }
  }

  // 날짜 범위 (교차 검증: 공연 시작 <= 검색 종료 && 공연 종료 >= 검색 시작)
  if (filters.startDate && filters.endDate) {
    query = query
      .lte("period_from", filters.endDate)
      .gte("period_to", filters.startDate);
  }

  // 4. 실행
  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const result = data as unknown as DBPerformance[];
  return result.map((item: DBPerformance) => mapToPerformance(item));
};
