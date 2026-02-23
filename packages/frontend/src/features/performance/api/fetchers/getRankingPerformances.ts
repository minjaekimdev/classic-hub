import supabase from "@/app/api/supabase-client";
import type { Period } from "@classic-hub/shared/types/client";
import type { DBRanking } from "@classic-hub/shared/types/database";

export const getRankingPerformances = async (
  period: Period,
  limit?: number,
) => {
  let query = supabase
    .from(`${period}_ranking_with_details`)
    .select("*")
    .order("current_rank", { ascending: true })
    .returns<DBRanking[]>();

  if (limit) {
    query = query.limit(limit);
  }

  const { error, data } = await query.returns<DBRanking[]>();

  if (error) {
    throw new Error(error.message || "[FETCH_FAIL] Ranking data fetch failed");
  }
  return data;
};
