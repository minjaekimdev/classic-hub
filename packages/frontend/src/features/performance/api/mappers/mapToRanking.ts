import type { RankingPerformance } from "@classic-hub/shared/types/client";
import type { DBRankingWithDetails } from "@classic-hub/shared/types/database";

export const mapToRanking = (
  performances: DBRankingWithDetails[],
): RankingPerformance[] => {
  return performances.map((item) => ({
    currentRank: item.current_rank,
    lastRank: item.last_rank,
    bookingLinks: item.booking_links,
    id: item.performance_id,
    poster: item.poster,
    title: item.performance_name,
    artist: item.cast,
    period: item.period,
    venue: item.venue_name,
  }));
};
