import { useQuery } from "@tanstack/react-query";
import { getRankingPerformances } from "../fetchers/getRankingPerformances";
import { mapToHomeRanking } from "../mappers/mapToHomeRanking";

export const useHomeRankingPerformances = (limit: number) => {
  return useQuery({
    queryKey: ["performance", "ranking", limit],
    queryFn: () => getRankingPerformances("daily", limit),
    select: (data) => data.map(mapToHomeRanking),
  });
};
