import formatDateRange from "@/shared/utils/formatDateRange";
import type { RankingPerformance } from "@classic-hub/shared/types/client";
import type { BookingLink } from "@classic-hub/shared/types/common";
import type { DBRanking } from "@classic-hub/shared/types/database";

const toRanking = (raw: DBRanking): RankingPerformance => ({
  currentRank: raw.current_rank ?? 0,
  lastRank: raw.last_rank,
  bookingLinks: raw.booking_links
    ? (raw.booking_links as unknown as BookingLink[])
    : [],
  id: raw.performance_id as string,
  poster: raw.poster ?? "",
  title: raw.performance_name ?? "",
  artist: raw.cast ?? "",
  period:
    raw.period_from && raw.period_to
      ? formatDateRange(raw.period_from, raw.period_to)
      : "",
  venue: raw.venue_name ?? "",
});

export default toRanking;
