// 공연 시작일, 종료일
export interface Date {
  start: string;
  end: string;
}

// 공통으로 사용되는 프로퍼티 모음
export interface Performance {
  id: string;
  poster: string;
  title: string;
  artist: string;
  date: Date;
  venue: string;
}

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
export interface RankingPerformance extends Performance {
  rank: number;
  rankChange?: number; // 주간, 월간 공연은 순위 변동을 표시하지 않음
}

// 상세 정보에서 사용
// 좌석 및 가격 정보
export interface SeatPriceInfo {
  seatType: string;
  price: number;
}
export interface DetailPerformance extends Performance {
  venueId: string;
  time: string;
  runningTime: string;
  age: string;
  priceInfo: SeatPriceInfo[];
  detailImages: string[];
}
