import type { PerformanceSummary } from "@classic-hub/shared/types/client";
import type { DBRankingWithDetails } from "@classic-hub/shared/types/database";
import formatMinMaxPrice from "@/shared/utils/formatMinMaxPrice";

const mapToHomeRanking = (raw: DBRankingWithDetails): PerformanceSummary => {
  const [startDate, endDate] = raw.period.split("~");
  const {minPrice, maxPrice} = formatMinMaxPrice(raw.price);

  return {
    id: raw.performance_id,
    title: raw.performance_name,
    poster: raw.poster,
    artist: raw.cast,
    venue: raw.venue_name,
    minPrice: minPrice,
    maxPrice: maxPrice,
    startDate,
    endDate,
    rank: raw.current_rank,
  };
};

export default mapToHomeRanking;
