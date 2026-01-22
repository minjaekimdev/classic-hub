import type { BookingLink, Price } from "./common";

// 공연장 데이터
export interface DBFacility {
  id: string;
  name: string;
  opening_year: string;
  facility_type: string;
  hall_count: number;
  tel: string;
  url: string;
  adress: string;
  latitude: number;
  longitude: number;
  has_restaurant: boolean;
  has_cafe: boolean;
  has_store: boolean;
  has_nolibang: boolean;
  has_suyu: boolean;
  has_parking: boolean;
  has_disabled_parking: boolean;
  has_disabled_restroom: boolean;
  has_disabled_ramp: boolean;
  has_disabled_elevator: boolean;
  seat_count: number;
}

export interface DBHall {
  id: string;
  name: string;
  seat_count: number;
  has_orchestra_pit: boolean;
  has_practice_room: boolean;
  has_dressing_room: boolean;
  has_outdoor_stage: boolean;
  disabled_seat_count: number;
  disabled_stage_area: string;
  facility_id: string; // FK
}

// 랭킹 데이터
export interface DBRanking {
  performance_id: string;
  current_rank: number;
  last_rank: number;
  performance_name: string;
  period: string;
  area: string;
  venue_name: string;
  seat_scale: number;
  performance_count: number;
  poster: string;
}

export interface DBRankingWithDetails {
  current_rank: number;
  last_rank: number | null;
  performance_id: string;
  poster: string;
  performance_name: string;
  period: string;
  venue_name: string;
  cast: string;
  price: Price[];
  booking_links: BookingLink[];
}

// 공연 데이터

export interface DBPerformance {
  performance_id: string; // 공연 id
  venue_id: string; // 공연시설 id
  performance_name: string;
  period_from: string;
  period_to: string;
  venue_name: string;
  cast: string;
  runtime: string;
  age: string;
  price: Price[];
  poster: string;
  state: string;
  booking_links: BookingLink[];
  detail_image: string[]; // 상세이미지 url을 배열로 담기
  time: string;
  raw_data: any;
}
