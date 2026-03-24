import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import type { Database } from "@classic-hub/shared/types/supabase";
import supabase from "@/app/api/supabase-client";
import formatQueryDate from "@/shared/utils/formatToQueryDate";
import type { SearchFilters } from "../../types";
import type { DBPerformanceRead } from "@classic-hub/shared/types/database";

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

export const getResultPerformances = async (
  filters: SearchFilters,
): Promise<DBPerformanceRead[]> => {
  // 1. 기본 쿼리 시작
  let query = supabase.from("performances").select("*");

  // 2. 동적 필터링 (값이 존재할 때만 체이닝)
  if (filters.keyword) {
    // 제목(title) 혹은 장소명(venue) 등 원하는 컬럼 지정
    query = query.or(
      `performance_name.ilike.%${filters.keyword}%, cast.ilike.%${filters.keyword}%`,
    );
  }

  // 키워드에 해당하는 공연들에 대한 정보 모두 가져오기
  
  // 각 공연마다
  // 키워드가 작곡가에 포함되는 경우 -> 첫 번째 곡명 같이 가져오기
  // 키워드가 특정 곡에 포함되는 경우 -> 해당 곡의 작곡가명 같이 가져오기
  // 키워드가 영어인 경우 영문 작곡가명 + 영문 곡명
  // 이 모든 경우에 해당 공연에서 연주되는 곡의 개수 가져오기

  // 지역
  if (filters.location) {
    query = getLocationQuery(query, filters.location);
  }

  // 가격 범위
  if (filters.minPrice) {
    query = query.gte("max_price", filters.minPrice);
    if (filters.maxPrice) {
      query = query.lte("min_price", filters.maxPrice);
    }
  }

  // 날짜 범위 (공연 종료일이 검색 범위 사이에 있어야함)
  if (filters.startDate && filters.endDate) {
    query = query
      .lte("period_to", formatQueryDate(filters.endDate))
      .gte("period_to", formatQueryDate(filters.startDate));
  }

  // 4. 실행
  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const result = data as unknown as DBPerformanceRead[];
  return result;
};
