/**
 * specs/home.md 구현 정책
 * - common-001: determineStatus — '공연중'/'공연예정' 상태 판정
 * - search-002: 검색은 DB RPC(search_concerts)가 담당 — 1계층 작곡가 그룹 AND(정밀),
 *   2계층 공연 AND+compact(폴백: 공연명/출연진/공연장 검색, exactMatch=false)
 * - search-004: fetchConcertStatusCounts — 공연 상태별 개수 조회
 * - search-006: PAGE_SIZE — 페이지당 결과 수 (⚠️ 스펙은 '최대 5개', 현재 10개로 불일치)
 * - exception-02: 존재하지 않는 페이지 요청은 search_concerts RPC 내부에서 마지막 페이지로 clamp
 */
import supabase from "@/api/supabase";
import { todayISO, toDotDate } from "@/lib/date";
import type {
  Concert,
  ConcertBookingLink,
  ConcertPage,
  ConcertProgram,
  ConcertProgramTitle,
  ConcertSeatPrice,
  ConcertStatusCounts,
  DateRange,
  SortBy,
  StatusFilter,
} from "@/types/concert";

export const PAGE_SIZE = 10;

/** 서버는 클라이언트 파라미터를 신뢰하지 않는다 — size 상한 clamp */
const MAX_PAGE_SIZE = 50;

const RPC_NAME = "search_concerts";

export class ConcertsApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ConcertsApiError";
    this.status = status;
  }
}

interface ConcertRow {
  performance_id: string | null;
  poster: string | null;
  performance_name: string | null;
  cast: string | null;
  period_from: string | null;
  period_to: string | null;
  venue_name: string | null;
  venue_address: string | null;
  performance_time: string | null;
  runtime: string | null;
  age: string | null;
  price: unknown;
  min_price: number | null;
  max_price: number | null;
  booking_links: unknown;
  programs: unknown;
}

export interface FetchConcertsParams {
  query: string;
  statusFilter: StatusFilter;
  dateRange: DateRange;
  sortBy: SortBy;
  page: number;
  pageSize?: number;
}

export interface FetchConcertCountsParams {
  query: string;
  dateRange: DateRange;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const asArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);

const toSeatPrice = (value: unknown): ConcertSeatPrice | null => {
  if (!isRecord(value)) return null;
  const { seatType, price } = value;
  if (typeof seatType !== "string" || typeof price !== "number") return null;
  return { seatType, price };
};

const toBookingLink = (value: unknown): ConcertBookingLink | null => {
  if (!isRecord(value)) return null;
  const { name, url } = value;
  if (typeof name !== "string" || typeof url !== "string") return null;
  return { name, url };
};

const toProgramTitle = (value: unknown): ConcertProgramTitle => {
  if (!isRecord(value)) return { ko: null, en: null };
  const { ko, en } = value;
  return {
    ko: typeof ko === "string" ? ko : null,
    en: typeof en === "string" ? en : null,
  };
};

const toProgram = (value: unknown): ConcertProgram | null => {
  if (!isRecord(value)) return null;
  const { composerKo, composerEn, titles } = value;
  const parsedTitles = asArray(titles)
    .map(toProgramTitle)
    .filter((title) => title.ko !== null || title.en !== null);
  if (parsedTitles.length === 0) return null;
  return {
    composerKo: typeof composerKo === "string" ? composerKo : null,
    composerEn: typeof composerEn === "string" ? composerEn : null,
    titles: parsedTitles,
  };
};

const toArtists = (cast: string | null): string[] => {
  if (!cast) return [];
  return cast
    .split(",")
    .map((artist) => artist.trim())
    .filter(Boolean);
};

/** 공연중: 오늘이 공연 기간 안 / 공연예정: 시작일이 오늘 이후 */
const determineStatus = (
  periodFrom: string,
  periodTo: string,
  today: string,
): Concert["status"] => {
  if (!periodFrom || !periodTo) return "upcoming";
  return periodFrom <= today && periodTo >= today ? "ongoing" : "upcoming";
};

const mapToConcert = (row: ConcertRow, today: string): Concert => ({
  id: row.performance_id ?? "",
  name: row.performance_name ?? "",
  poster: row.poster,
  status: determineStatus(row.period_from ?? "", row.period_to ?? "", today),
  artists: toArtists(row.cast),
  periodFrom: row.period_from ?? "",
  periodTo: row.period_to ?? "",
  time: row.performance_time,
  runtime: row.runtime,
  age: row.age,
  venueName: row.venue_name ?? "",
  venueAddress: row.venue_address,
  seatPrices: asArray(row.price)
    .map(toSeatPrice)
    .filter((item): item is ConcertSeatPrice => item !== null),
  minPrice: row.min_price,
  maxPrice: row.max_price,
  bookingLinks: asArray(row.booking_links)
    .map(toBookingLink)
    .filter((item): item is ConcertBookingLink => item !== null),
  programs: asArray(row.programs)
    .map(toProgram)
    .filter((item): item is ConcertProgram => item !== null),
});

/**
 * 검색 RPC 인자 (specs search-002)
 * 매칭 로직은 DB 함수 search_concerts가 단일 소스로 담당한다:
 * - 1계층(정밀): 작곡가 그룹 단위 AND — '쇼팽 피아노 협주곡'의 단어들이 서로 다른 곡에 흩어진 공연은 제외
 * - 2계층(폴백): 공연 단위 AND + compact — 공연명/출연진/공연장 검색 지원 (exactMatch=false)
 */
export const buildSearchRpcArgs = (
  params: {
    query: string;
    statusFilter: StatusFilter;
    dateRange: DateRange;
    sortBy: SortBy;
    page: number;
    pageSize?: number;
  },
  today: string,
) => ({
  p_keyword: params.query.trim(),
  p_status: params.statusFilter,
  p_period_from: toDotDate(params.dateRange.start),
  p_period_to: toDotDate(params.dateRange.end),
  p_sort: params.sortBy,
  p_page: params.page,
  p_page_size: Math.min(params.pageSize ?? PAGE_SIZE, MAX_PAGE_SIZE),
  p_today: toDotDate(today),
});

interface SearchConcertsPayload {
  items: ConcertRow[] | null;
  total: number;
  page: number;
  totalPages: number;
  /** DB 매칭 계층 정보(1계층 정밀/2계층 폴백) — 현재 UI에서 미사용, RPC 응답 계약으로만 유지 */
  exactMatch: boolean;
  counts: ConcertStatusCounts | null;
}

const callSearchConcerts = async (
  args: Record<string, unknown>,
): Promise<SearchConcertsPayload> => {
  const { data, error } = await supabase.rpc(RPC_NAME, args);
  if (error) {
    throw new ConcertsApiError(error.message, 500);
  }
  return data as SearchConcertsPayload;
};

export const fetchConcerts = async (params: FetchConcertsParams): Promise<ConcertPage> => {
  const today = todayISO();
  const payload = await callSearchConcerts({
    ...buildSearchRpcArgs(params, today),
    p_with_counts: false,
  });

  return {
    items: asArray(payload.items).map((row) => mapToConcert(row as ConcertRow, toDotDate(today))),
    total: payload.total,
    page: payload.page,
    totalPages: payload.totalPages,
  };
};

export const fetchConcertStatusCounts = async (
  params: FetchConcertCountsParams,
): Promise<ConcertStatusCounts> => {
  const payload = await callSearchConcerts({
    ...buildSearchRpcArgs(
      {
        query: params.query,
        statusFilter: "all",
        dateRange: params.dateRange,
        sortBy: "imminent",
        page: 1,
        pageSize: 1,
      },
      todayISO(),
    ),
    p_with_counts: true,
  });

  return payload.counts ?? { all: payload.total, ongoing: 0, upcoming: 0 };
};
