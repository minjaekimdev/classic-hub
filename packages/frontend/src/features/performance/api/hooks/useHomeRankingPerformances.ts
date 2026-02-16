import { useSuspenseQuery } from "@tanstack/react-query";
import { getHomeRankingPerformances } from "../fetchers/getHomeRankingPerformances";

export const useHomeRankingPerformances = (limit: number) => {
  return useSuspenseQuery({
    queryKey: ["performances", "ranking", limit],
    queryFn: () => getHomeRankingPerformances(limit),
  });
};
