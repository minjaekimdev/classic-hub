import type { RankingPerformance } from "@classic-hub/shared/types/client";
import type { DBRankingWithDetails } from "@classic-hub/shared/types/database";

const mapToRanking = (raw: DBRankingWithDetails): RankingPerformance => ({
  current_rank: raw.current_rank,
  last_rank: raw.last_rank,
  bookingLinks: raw.booking_links,
  id: raw.performance_id,
  poster: raw.poster,
  title: raw.performance_name,
  artist: raw.cast,
  period: raw.period,
  venue: raw.venue_name,
})

export default mapToRanking;