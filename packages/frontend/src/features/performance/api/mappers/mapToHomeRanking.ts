import formatMinMaxPrice from "@/shared/utils/formatMinMaxPrice";
import type { Price } from "@classic-hub/shared/types/common";
import type { DBRanking } from "@classic-hub/shared/types/database";

export const mapToHomeRanking = (data: DBRanking) => {
  const { minPrice, maxPrice } = formatMinMaxPrice(
    data.price as unknown as Price[] | null,
  );
  return {
    id: data.performance_id ?? "",
    title: data.performance_name ?? "",
    poster: data.poster ?? "",
    artist: data.cast ?? "",
    venue: data.venue_name ?? "",
    minPrice,
    maxPrice,
    startDate: data.period_from ?? "",
    endDate: data.period_to ?? "",
    rank: data.current_rank ?? undefined,
    composers: (data.composers_ko as string[]) ?? [],
  };
};
