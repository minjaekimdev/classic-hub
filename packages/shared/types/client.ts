import type { BookingLink, Location, Price as SeatPrice } from "./common";

// 공통으로 사용되는 프로퍼티 모음
export interface Performance {
  id: string;
  title: string;
  poster: string;
  artist: string;
  venue: string;
}

export interface PerformanceSummary extends Performance {
  period: string;
  minPrice: number;
  maxPrice: number;
}

export interface HomeRankingPerformance extends PerformanceSummary {
  rank: number;
}

// 랭킹 페이지 공연
export type Period = "daily" | "weekly" | "monthly";

export interface RankingPerformance extends Performance {
  currentRank: number;
  period: string;
  lastRank: number | null;
  bookingLinks: BookingLink[];
}

// 상세 정보에서 사용
// 좌석 및 가격 정보
export interface DetailPerformance extends Performance {
  venueId: string;
  time: string;
  runningTime: string;
  age: string;
  area: Location;
  minPrice: number;
  maxPrice: number;
  startDate: string;
  endDate: string;
  priceInfo: SeatPrice[];
  detailImages: string[];
  bookingLinks: BookingLink[];
}

export interface Hall {
  name: string | null;
  tel: string | null;
  url: string | null;
  address: string | null;
  seatCount: number
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