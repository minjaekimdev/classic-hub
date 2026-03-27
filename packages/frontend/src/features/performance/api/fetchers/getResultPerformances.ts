import supabase from "@/app/api/supabase-client";
import formatQueryDate from "@/shared/utils/formatToQueryDate";
import type { SearchFilters } from "../../types";
import type {
  DBPerformanceRead,
  DBProgramsRead,
} from "@classic-hub/shared/types/database";

const getLocationQuery = (query: any, location: string) => {
  const areaMap: Record<string, string[]> = {
    충북: ["충북", "충청북도"],
    충남: ["충남", "충청남도"],
    전북: ["전북", "전라북도", "전북특별자치도"],
    전남: ["전남", "전라남도"],
    경북: ["경북", "경상북도"],
    경남: ["경남", "경상남도"],
    제주: ["제주", "제주특별자치도"],
  };

  if (location in areaMap) {
    return query.in("area", areaMap[location]);
  }
  return query.ilike("area", `%${location}%`);
};

type PerformanceType = Pick<
  DBPerformanceRead,
  | "performance_id"
  | "poster"
  | "performance_name"
  | "cast"
  | "period_from"
  | "period_to"
  | "venue_id"
  | "venue_name"
  | "min_price"
  | "max_price"
  | "booking_links"
  | "area"
>;

type ProgramType = Pick<
  DBProgramsRead,
  "composer_ko" | "composer_en" | "title_ko" | "title_en"
>;

export type PerformanceWithProgram = PerformanceType & {
  programs: ProgramType[];
};

export const getResultPerformances = async (
  filters: SearchFilters,
): Promise<PerformanceWithProgram[]> => {
  let query = supabase.from("performances_with_program_view").select("*");

  // 2. 동적 필터링 (값이 존재할 때만 체이닝)
  if (filters.keyword) {
    query = query.ilike("search_target", `%${filters.keyword}%`);
  }

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

  const result = data as unknown as PerformanceWithProgram[];

  return result;
};
