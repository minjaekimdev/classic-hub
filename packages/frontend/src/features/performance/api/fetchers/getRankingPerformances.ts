import supabase from "@/app/api/supabase-client";
import type { DBRankingWithDetails } from "@classic-hub/shared/types/database";
import type { Period } from "@classic-hub/shared/types/client";

export const getRankingPerformances = async (
  period: Period,
  limit?: number,
) => {
  let query = supabase
    .from(`${period}_ranking_with_details`)
    .select("*")
    .order("current_rank", { ascending: true })
    .returns<DBRankingWithDetails[]>();

  if (limit) {
    query = query.limit(limit);
  }

  const { error, data } = await query.returns<DBRankingWithDetails[]>();

  if (error) {
    throw new Error(error.message || "[FETCH_FAIL] Ranking data fetch failed");
  }
  return data;
};
