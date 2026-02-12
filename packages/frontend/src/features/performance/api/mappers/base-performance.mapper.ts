import type { PerformanceSummary } from "@classic-hub/shared/types/client";
import type { DBPerformance } from "@classic-hub/shared/types/database";

const toBasePerformance = (raw: DBPerformance): PerformanceSummary => ({
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

export default toBasePerformance;