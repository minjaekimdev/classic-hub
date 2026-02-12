import supabase from "@/app/api/supabase-client";
import type { PerformanceSummary } from "@classic-hub/shared/types/client";
import { useEffect, useState } from "react";
import mapToHomeRanking from "../mappers/home-ranking.mapper";
import type { DBRankingWithDetails } from "@classic-hub/shared/types/database";

const useHomeRankingPerformance = (limit: number) => {
  const [data, setData] = useState<PerformanceSummary[]>([]);

  useEffect(() => {
    const fetchPerformances = async () => {
      const { error, data } = await supabase
        .from("daily_ranking_with_details")
        .select("*")
        .gte("current_rank", 1)
        .lte("current_rank", limit)
        .order("current_rank", { ascending: true })
        .returns<DBRankingWithDetails[]>();

      if (error) {
        console.log("[FETCH_FAIL] HomePerformance data fetch failed");
      } else {
        setData(data.map((item: DBRankingWithDetails) => mapToHomeRanking(item)));
      }
    };
    fetchPerformances();
  }, [limit]);

  return data;
};

export default useHomeRankingPerformance;
