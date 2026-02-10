import formatDateRange from "@/shared/utils/formatDateRange";
import type { DetailPerformance } from "@classic-hub/shared/types/client";
import type { DBPerformance } from "@classic-hub/shared/types/database";

const mapToPerformanceDetail = (raw: DBPerformance): DetailPerformance => {
  return {
    id: raw.performance_id,
    poster: raw.poster,
    title: raw.performance_name,
    artist: raw.cast,
    bookingLinks: raw.booking_links,
    period: formatDateRange(raw.period_from, raw.period_to),
    area: raw.area,
    minPrice: raw.min_price,
    maxPrice: raw.max_price,
    venue: raw.venue_name,
    venueId: raw.venue_id,
    time: raw.time,
    runningTime: raw.runtime,
    age: raw.age,
    priceInfo: raw.price,
    detailImages: raw.detail_image,
  };
};

export default mapToPerformanceDetail;
