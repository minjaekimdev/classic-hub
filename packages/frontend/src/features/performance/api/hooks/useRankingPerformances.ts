import { useQuery } from "@tanstack/react-query";
import { getRankingPerformances } from "../fetchers/getRankingPerformances";
import type { Period } from "@classic-hub/shared/types/client";
import { mapToRanking } from "../mappers/mapToRanking";

export const useRankingPerformances = (period: Period) => {
  return useQuery({
    queryKey: ["performance", "ranking", period],
    queryFn: () => getRankingPerformances(period),
    select: (item) => item.map(mapToRanking),
  });
};
