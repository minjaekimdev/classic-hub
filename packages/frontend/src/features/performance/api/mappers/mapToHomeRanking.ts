import type { DBRanking } from "@classic-hub/shared/types/database";

export const mapToHomeRanking = (data: DBRanking) => {
  return {
    id: data.performance_id ?? "",
    title: data.performance_name ?? "",
    poster: data.poster ?? "",
    artist: data.cast ?? "",
    venue: data.venue_name ?? "",
    minPrice: data.min_price ?? null,
    maxPrice: data.max_price ?? null,
    startDate: data.period_from ?? "",
    endDate: data.period_to ?? "",
    rank: data.current_rank ?? undefined,
    composers: (data.composers_ko as string[]) ?? [],
  };
};
