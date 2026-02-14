// 1차 검색 필터 카테고리
export type FieldType =
  | "keyword"
  | "location"
  | "price"
  | "period";

export type SearchCategory = Record<FieldType, string>;

// 1차 필터의 실제 값은 가격은 min max, 기간은 start와 end로 분리하여 관리
export interface SearchValue {
  keyword: string;
  location: string;
  minPrice: string;
  maxPrice: string;
  startDate: string;
  endDate: string;
}

export interface SearchFilterContextType {
  searchValue: SearchValue;
  activeField: FieldType | null; // 현재 활성화된 카테고리 드롭다운 상태 저장
  changeValue: (value: SearchValue) => void;
  reset: () => void;
  search: () => void;
  openField: (field: FieldType) => void;
  closeField: () => void;
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
