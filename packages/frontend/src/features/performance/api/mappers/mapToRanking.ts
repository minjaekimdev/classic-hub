import formatDateRange from "@/shared/utils/formatDateRange";
import type { RankingPerformance } from "@classic-hub/shared/types/client";
import type { BookingLink } from "@classic-hub/shared/types/common";
import type { DBRanking } from "@classic-hub/shared/types/database";

export const mapToRanking = (raw: DBRanking): RankingPerformance => ({
  currentRank: raw.current_rank!,
  lastRank: raw.last_rank,
  bookingLinks: raw.booking_links as unknown as BookingLink[] | null,
  id: raw.performance_id!,
  poster: raw.poster,
  title: raw.performance_name,
  artist: raw.cast,
  period: formatDateRange(raw.period_from, raw.period_to),
  venue: raw.venue_name,
});
