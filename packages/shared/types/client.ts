import type { BookingLink, Price as SeatPrice } from "./common";

// 공통으로 사용되는 프로퍼티 모음
export interface Performance {
  id: string;
  poster: string;
  title: string;
  artist: string;
  period: string;
  venue: string;
}

// 공연 카드에서 최소 가격, 최대 가격 표시
interface Price {
  min: number;
  max: number;
}

// 검색 결과 페이지 공연
export interface PerformanceSummary extends Performance {
  time: string;
  price: Price;
}

export interface HomePerformance {
  id: string;
  rank?: number;
  poster: string;
  title: string;
  artist: string;
  date: string;
  venue: string;
  price: Price;
}

// 랭킹 페이지 공연
export type Period = "daily" | "weekly" | "monthly";

export interface RankingPerformance extends Performance {
  current_rank: number;
  last_rank: number | null;
  bookingLinks: BookingLink[];
}

// 상세 정보에서 사용
// 좌석 및 가격 정보
export interface DetailPerformance extends Performance {
  venueId: string;
  time: string;
  runningTime: string;
  age: string;
  priceInfo: SeatPrice[];
  detailImages: string[];
}
