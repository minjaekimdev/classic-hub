import { mapBasePerformance } from "@/features/performance/mappers/home-performance-mapper";
import formatDateRange from "@/shared/utils/formatDateRange";
import type { HomePerformance } from "@classic-hub/shared/types/client";
import type { DBRankingWithDetails } from "@classic-hub/shared/types/database";

const mapToHomeRanking = (
  raw: DBRankingWithDetails,
): HomePerformance => {
  const [startDate, endDate] = raw.period.split("~");

  return {
    ...mapBasePerformance(raw),
    rank: raw.current_rank,
    period: formatDateRange(startDate, endDate),
  };
};

export default mapToHomeRanking;
