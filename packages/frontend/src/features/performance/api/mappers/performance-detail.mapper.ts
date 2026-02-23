import type { DetailPerformance } from "@classic-hub/shared/types/client";
import type { BookingLink, Price } from "@classic-hub/shared/types/common";
import type { DBPerformanceRead } from "@classic-hub/shared/types/database";

const mapToPerformanceDetail = (raw: DBPerformanceRead): DetailPerformance => {
  console.log(raw);
  return {
    id: raw.performance_id,
    poster: raw.poster ?? "",
    title: raw.performance_name ?? "",
    artist: raw.cast ?? "",
    bookingLinks: raw.booking_links
      ? (raw.booking_links as unknown as BookingLink[])
      : [],
    startDate: raw.period_from ?? "",
    endDate: raw.period_to ?? "",
    area: raw.area ?? "",
    minPrice: raw.min_price,
    maxPrice: raw.max_price,
    venue: raw.venue_name ?? "",
    venueId: raw.venue_id ?? "",
    time: raw.time ?? "",
    runningTime: raw.runtime ?? "",
    age: raw.age ?? "",
    priceInfo: raw.price ? (raw.price as unknown as Price[]) : [],
    detailImages: raw.detail_image
      ? (raw.detail_image as unknown as string[])
      : [],
  };
};

export default mapToPerformanceDetail;
