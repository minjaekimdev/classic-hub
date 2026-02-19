import type { PerformanceSummary } from "@classic-hub/shared/types/client";
import formatMinMaxPrice from "@/shared/utils/formatMinMaxPrice";
import type { DBRanking } from "@classic-hub/shared/types/database";
import type { Price } from "@classic-hub/shared/types/common";

const mapToHomeRanking = (raw: DBRanking): PerformanceSummary => {
  const [startDate, endDate] = [raw.period_from, raw.period_to];
  const { minPrice, maxPrice } = formatMinMaxPrice(raw.price as unknown as Price[] | null);

  return {
    id: raw.performance_id as string,
    title: raw.performance_name as string,
    poster: raw.poster as string,
    artist: raw.cast ?? "",
    venue: raw.venue_name as string,
    minPrice: minPrice,
    maxPrice: maxPrice,
    startDate: startDate as string,
    endDate: endDate as string,
    rank: raw.current_rank as number,
  };
};

export default mapToHomeRanking;
