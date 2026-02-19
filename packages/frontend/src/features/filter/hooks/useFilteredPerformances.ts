import type { DetailPerformance } from "@classic-hub/shared/types/client";

const useFilteredPerformances = (
  performances: DetailPerformance[],
  selectedVenues: string[],
) => {
  const selectedVenueIdSet = new Set(selectedVenues);
  if (selectedVenueIdSet.size === 0) {
    return performances;
  }

  return performances.filter((perf) => selectedVenueIdSet.has(perf.venueId!));
};

export default useFilteredPerformances;
