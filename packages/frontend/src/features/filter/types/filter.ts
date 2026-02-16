// 1차 검색 필터 카테고리
export interface SearchCategory {
  keyword: string;
  location: string;
  price: string;
  period: string;
}

// 2차 검색 필터 카테고리
export interface Venue {
  id: string;
  name: string;
  count: number;
}

export interface Region {
  name: string;
  totalCount: number; // 해당 지역 공연장들의 합산 개수
  venues: Venue[];
}

export type SortType = "imminent" | "price-low" | "price-high" | "alphabetical";

// 전체 필터 카테고리(URL로부터 추출)
export interface Filter {
  keyword: string | null;
  location: string | null;
  minPrice: string | null;
  maxPrice: string | null;
  startDate: string | null;
  endDate: string | null;
  sortBy: string | null;
  selectedVenues: Array<string>;
}
