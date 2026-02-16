import supabase from "@/app/api/supabase-client";
import mapToHomeRanking from "../mappers/home-ranking.mapper";
import type { DBRankingWithDetails } from "@classic-hub/shared/types/database";

export const getHomeRankingPerformances = async (limit: number) => {
  const { error, data } = await supabase
    .from("daily_ranking_with_details")
    .select("*")
    .gte("current_rank", 1)
    .lte("current_rank", limit)
    .order("current_rank", { ascending: true })
    .returns<DBRankingWithDetails[]>();

  if (error) {
    throw new Error(
      error.message || "[FETCH_FAIL] Home Ranking data fetch failed",
    );
  }
  return data.map((item: DBRankingWithDetails) => mapToHomeRanking(item));
};
