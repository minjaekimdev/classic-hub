import supabase from "@/app/api/supabase-client";
import type {
  Period,
  RankingPerformance,
} from "@classic-hub/shared/types/client";
import { useEffect, useState } from "react";
import mapToRanking from "../mappers/ranking-mapper";
import type { DBRankingWithDetails } from "@classic-hub/shared/types/database";

const useRankingPerformance = (period: Period) => {
  const [performance, setPerformance] = useState<RankingPerformance[]>([]);
  useEffect(() => {
    const fetchRankingPerformance = async () => {
      const { error, data } = await supabase
        .from(`${period}_ranking_with_details`)
        .select("*")
        .returns<DBRankingWithDetails[]>();

      if (error) {
        console.log("[FETCH_FAIL] Ranking fetch failed");
      } else {
        setPerformance(
          data.map((item: DBRankingWithDetails) => mapToRanking(item)),
        );
      }
    };

    fetchRankingPerformance();
  }, [period]);

  return performance;
};

export default useRankingPerformance;
