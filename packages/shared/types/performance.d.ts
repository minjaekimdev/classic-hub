interface TicketVendorType {
  name: string;
  url: string;
}

export interface Performance {
  id?: string;
  posterUrl: string;
  title: string;
  artist: string;
  stdate: string;
  eddate: string;
  hall: string;
}

export interface PriceRange {
  minPrice: string;
  maxPrice?: string; // 홈에서는 최고가를 보여주지 않으므로 optional
}




export interface PerformanceType {
  posterUrl: string;
  title: string;
  artist: string;
  composerArray: string[];
  time: string;
  stdate: string;
  eddate: string;
  hall: string;
  lowPrice: string;
  highPrice?: string; // 홈에서 표시되는 공연은 최고가를 보여주지 않음
}

export type PerformanceAndComposer = Omit<PerformanceType, "posterUrl"> & {
  composerArray: string[];
};