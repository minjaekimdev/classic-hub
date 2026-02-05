import formatDateRange from "@/shared/utils/formatDateRange";
import type { PerformanceSummary } from "@classic-hub/shared/types/client";
import type { DBRankingWithDetails } from "@classic-hub/shared/types/database";
import { mapBasePerformance } from "./home-performance-mapper";

const mapToHomeRanking = (raw: DBRankingWithDetails): PerformanceSummary => {
  const [startDate, endDate] = raw.period.split("~");

  return {
    ...mapBasePerformance(raw),
    rank: raw.current_rank,
    period: formatDateRange(startDate, endDate),
  };
};

export default mapToHomeRanking;
