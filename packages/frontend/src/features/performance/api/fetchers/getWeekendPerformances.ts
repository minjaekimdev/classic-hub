import supabase from "@/app/api/supabase-client";
import type { DBWeekendPerformances } from "@classic-hub/shared/types/database";

export const getWeekendPerformances = async () => {
  const { error, data } = await supabase
    .from("weekend_performances_with_program")
    .select("*")
    .returns<DBWeekendPerformances[]>();

  if (error) {
    throw new Error(
      error.message || "[FETCH_FAIL] Home Weekend Ranking data fetch failed",
    );
  }

  return data;
};
