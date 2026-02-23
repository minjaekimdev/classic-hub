import type { DetailPerformance } from "@classic-hub/shared/types/client";
import { useMemo } from "react";

const useFilteredPerformances = (
  performances: DetailPerformance[],
  selectedVenues: string[],
) => {
  const result = useMemo(() => {
    const selectedVenueIdSet = new Set(selectedVenues);
    if (selectedVenueIdSet.size === 0) {
      return performances;
    }

    return performances.filter((perf) => selectedVenueIdSet.has(perf.venueId!));
  }, [performances, selectedVenues]);

  return result;
};

export default useFilteredPerformances;
