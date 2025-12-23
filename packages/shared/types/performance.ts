export interface Date {
  start: string;
  end: string;
}

export interface Performance {
  id: string;
  posterUrl: string;
  title: string;
  artist: string;
  date: Date;
  venue: string;
}

export interface PriceRange {
  min: number;
  max: number;
}

// 검색 결과 페이지 공연
export interface PerformanceSummary extends Performance {
  composerArray: string[];
  time: string;
  price: PriceRange;
}

// 홈페이지 공연
export interface HomePerformance extends PerformanceSummary {
  rank?: number; // '오늘의 공연 랭킹'을 제외하곤 랭킹을 보여주지 않음
}

// 랭킹 페이지 공연
export interface RankingPerformance extends Performance {
  rank: number;
  rankChange?: number; // 주간, 월간 공연은 순위 변동을 표시하지 않음
}

// 상세 정보에서 사용
// 좌석 및 가격 정보
export interface SeatPriceInfo { 
  seat: string;
  price: number;
}
export interface DetailPerformance extends Performance {
  time: string;
  runningTime: string;
  priceInfo: SeatPriceInfo[];
}
