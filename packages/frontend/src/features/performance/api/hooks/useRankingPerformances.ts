import { useQuery } from "@tanstack/react-query";
import { getRankingPerformances } from "../fetchers/getRankingPerformances";
import type { Period } from "@classic-hub/shared/types/client";

export const useRankingPerformances = (period: Period) => {
  return useQuery({
    queryKey: ["performance", "ranking", period],
    queryFn: () => getRankingPerformances(period),
  });
};
