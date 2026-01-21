import type {
  DBPerformance,
  DBRankingWithDetails,
} from "@classic-hub/shared/types/database";
import type { HomePerformance } from "@classic-hub/shared/types/client";
import formatDateRange from "@/shared/utils/formatDateRange";
import formatMinMaxPrice from "@/shared/utils/formatMinMaxPrice";

export const mapBasePerformance = (
  raw: DBPerformance | DBRankingWithDetails,
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
