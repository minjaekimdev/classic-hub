import type { DBRankingWithDetails } from "@classic-hub/shared/types/database";
import formatMinMaxPrice from "@/shared/utils/formatMinMaxPrice";
import formatDateRange from "@/shared/utils/formatDateRange";
import type { HomePerformanceRanking } from "@classic-hub/shared/types/client";

export const mapToHomeRanking = (
  data: DBRankingWithDetails,
): HomePerformanceRanking => {
  const [startDate, endDate] = data.period.split("~");
  const { minPrice, maxPrice } = formatMinMaxPrice(data.price);
  return {
    id: data.performance_id,
    title: data.performance_name,
    poster: data.poster,
    artist: data.cast,
    venue: data.venue_name,
    minPrice,
    maxPrice,
    period: formatDateRange(startDate, endDate),
    rank: data.current_rank,
  };
};
