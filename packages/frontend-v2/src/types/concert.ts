export type ConcertStatus = "ongoing" | "upcoming";

/** 공연 목록 상태 필터 ("전체" | "공연중" | "공연예정") */
export type StatusFilter = "all" | "ongoing" | "upcoming";

/** 정렬 기준 (공연임박순 | 낮은가격순 | 높은가격순) */
export type SortBy = "imminent" | "price_asc" | "price_desc";

/** YYYY-MM-DD 형식의 날짜 */
export type IsoDate = string;

export interface DateRange {
  start: IsoDate;
  end: IsoDate;
}

export interface ConcertProgramTitle {
  ko: string | null;
  en: string | null;
}

export interface ConcertProgram {
  composerKo: string | null;
  composerEn: string | null;
  titles: ConcertProgramTitle[];
}

export interface ConcertSeatPrice {
  seatType: string;
  price: number;
}

export interface ConcertBookingLink {
  name: string;
  url: string;
}

export interface Concert {
  id: string;
  name: string;
  poster: string | null;
  status: ConcertStatus;
  /** 출연진 (콤마 구분 문자열을 분리한 목록) */
  artists: string[];
  periodFrom: string;
  periodTo: string;
  /** "금 20:00, 토 17:00" 형태의 회차 정보 */
  time: string | null;
  runtime: string | null;
  age: string | null;
  venueName: string;
  venueAddress: string | null;
  seatPrices: ConcertSeatPrice[];
  minPrice: number | null;
  maxPrice: number | null;
  bookingLinks: ConcertBookingLink[];
  programs: ConcertProgram[];
}

export interface ConcertPage {
  items: Concert[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ConcertStatusCounts {
  all: number;
  ongoing: number;
  upcoming: number;
}
