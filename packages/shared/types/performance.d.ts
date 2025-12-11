export interface PerformanceType {
  posterUrl: string;
  name: string;
  artist: string;
  date: string;
  hall: string;
}

export interface RankingPerformanceType extends PerformanceType{
  rank: string;
}