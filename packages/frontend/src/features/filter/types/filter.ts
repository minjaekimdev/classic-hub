// 예시 데이터 타입 정의
export type Venue = {
  id: string;
  name: string;
  count: number;
};

export type Region = {
  id: string;
  name: string;
  totalCount: number; // 해당 지역 공연장들의 합산 개수
  venues: Venue[];
};

export type SortType = "imminent" | "price-low" | "price-high" | "alphabetical";
