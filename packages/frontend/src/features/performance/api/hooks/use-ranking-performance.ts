import supabase from "@/app/api/supabase-client";
import type {
  Period,
  RankingPerformance,
} from "@classic-hub/shared/types/client";
import { useEffect, useState } from "react";
import mapToRanking from "../mappers/ranking.mapper";
import type { DBRanking } from "@classic-hub/shared/types/database";

const useRankingPerformance = (period: Period) => {
  const [performance, setPerformance] = useState<RankingPerformance[]>([]);
  useEffect(() => {
    const fetchRankingPerformance = async () => {
      const { error, data } = await supabase
        .from(`${period}_ranking_with_details`)
        .select("*")
        .returns<DBRanking[]>();

      if (error) {
        console.log("[FETCH_FAIL] Ranking fetch failed");
      } else {
        setPerformance(data.map((item: DBRanking) => mapToRanking(item)));
      }
    };

    fetchRankingPerformance();
  }, [period]);

  return performance;
};

export default useRankingPerformance;
