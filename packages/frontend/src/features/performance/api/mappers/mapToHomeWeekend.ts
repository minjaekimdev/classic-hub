import type { PerformanceSummary } from "@classic-hub/shared/types/client";
import type { DBPerformanceRead } from "@classic-hub/shared/types/database";

export const mapToHomeWeekend = (raw: DBPerformanceRead): PerformanceSummary => ({
  id: raw.performance_id,
  title: raw.performance_name,
  poster: raw.poster,
  artist: raw.cast,
  venue: raw.venue_name,
  minPrice: raw.min_price,
  maxPrice: raw.max_price,
  startDate: raw.period_from,
  endDate: raw.period_to,
});
