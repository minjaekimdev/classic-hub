import formatDateRange from "@/shared/utils/formatDateRange";
import type { PerformanceSummary } from "@classic-hub/shared/types/client";
import type { DBPerformance } from "@classic-hub/shared/types/database";

export const mapToHomeWeekend = (raw: DBPerformance): PerformanceSummary => ({
  id: raw.performance_id,
  title: raw.performance_name,
  poster: raw.poster,
  artist: raw.cast,
  venue: raw.venue_name,
  minPrice: raw.min_price,
  maxPrice: raw.max_price,
  period: formatDateRange(raw.period_from, raw.period_to),
});
