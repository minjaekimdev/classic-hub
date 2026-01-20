import type {
  DBdailyRankingWithDetails,
  DBPerformance,
} from "@classic-hub/shared/types/database";
import type { HomePerformance } from "@classic-hub/shared/types/client";
import formatDateRange from "@/shared/utils/formatDate";
import formatMinMaxPrice from "@/shared/utils/formatMinMaxPrice";

const mapBasePerformance = (
  raw: DBPerformance | DBdailyRankingWithDetails,
) => ({
  id: raw.performance_id,
  title: raw.performance_name,
  poster: raw.poster,
  artist: raw.cast,
  venue: raw.venue_name,
  price: formatMinMaxPrice(raw.price),
});

export const mapToHomePerformance = (raw: DBPerformance): HomePerformance => {
  return {
    ...mapBasePerformance(raw),
    date: formatDateRange(raw.period_from, raw.period_to),
  };
};

export const mapToHomeRanking = (
  raw: DBdailyRankingWithDetails,
): HomePerformance => {
  const [startDate, endDate] = raw.period.split("~");

  return {
    ...mapBasePerformance(raw),
    rank: raw.current_rank,
    date: formatDateRange(startDate, endDate),
  };
};
