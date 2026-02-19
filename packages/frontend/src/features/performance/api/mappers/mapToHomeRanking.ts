import formatMinMaxPrice from "@/shared/utils/formatMinMaxPrice";
import type { PerformanceSummary } from "@classic-hub/shared/types/client";
import type { DBRanking } from "@classic-hub/shared/types/database";
import type { Price } from "@classic-hub/shared/types/common";

export const mapToHomeRanking = (data: DBRanking): PerformanceSummary => {
  const { minPrice, maxPrice } = formatMinMaxPrice(
    data.price as unknown as Price[] | null,
  );
  return {
    id: data.performance_id!,
    title: data.performance_name ?? "",
    poster: data.poster ?? "",
    artist: data.cast ?? "",
    venue: data.venue_name ?? "",
    minPrice,
    maxPrice,
    startDate: data.period_from ?? "",
    endDate: data.period_to ?? "",
    rank: data.current_rank!,
  };
};
