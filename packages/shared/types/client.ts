import type { BookingLink, Program, Price as SeatPrice } from "./common";

// 공통으로 사용되는 프로퍼티 모음
export interface Performance {
  id: string;
  title: string | null;
  poster: string | null;
  artist: string | null;
  venue: string | null;
}

// 공연 카드 기본 정보
export interface PerformanceSummary extends Performance {
  rank?: number;
  minPrice: number | null;
  maxPrice: number | null;
  startDate: string | null;
  endDate: string | null;
  composers: string[];
}

// 랭킹 페이지 공연
export type Period = "daily" | "weekly" | "monthly";

export interface RankingPerformance extends Performance {
  currentRank: number;
  period: string | null;
  lastRank: number | null;
  bookingLinks: BookingLink[] | null;
}

// 결과 페이지 공연 카드
export interface ResultPerformance {
  id: string;
  poster: string | null;
  title: string | null;
  artist: string | null;
  bookingLinks: BookingLink[];
  startDate: string | null;
  endDate: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  venueId: string | null;
  venue: string | null;
  area: string | null;
  programs: Program[];
}

// 상세 정보에서 사용
// 좌석 및 가격 정보
export interface DetailPerformance extends Performance {
  venueId: string | null;
  time: string | null;
  runningTime: string;
  age: string | null;
  area: string | null;
  minPrice: number | null; // 가격 정보가 제공되지 않는 경우 null로 구분
  maxPrice: number | null;
  startDate: string | null;
  endDate: string | null;
  priceInfo: SeatPrice[];
  detailImages: string[];
  bookingLinks: BookingLink[];
  program: Program[];
}

export interface Hall {
  name: string | null;
  tel: string | null;
  url: string | null;
  address: string | null;
  seatCount: number | null;
  restaurant: boolean;
  cafe: boolean;
  store: boolean;
  nolibang: boolean;
  suyu: boolean;
  parking: boolean;
  disabledParking: boolean;
  disabledRestroom: boolean;
  disabledRamp: boolean;
  disabledElevator: boolean;
}
