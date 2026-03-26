import type { ResultPerformance } from "@classic-hub/shared/types/client";
import type { BookingLink, Program } from "@classic-hub/shared/types/common";
import type { PerformanceWithProgram } from "../fetchers/getResultPerformances";

const mapToResult = (raw: PerformanceWithProgram): ResultPerformance => {
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
    minPrice: raw.min_price,
    maxPrice: raw.max_price,
    venueId: raw.venue_id,
    venue: raw.venue_name ?? "",
    area: raw.area ?? "",
    programs: raw.programs as unknown as Program[],
  };
};

export default mapToResult;
