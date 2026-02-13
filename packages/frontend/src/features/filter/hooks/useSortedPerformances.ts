import { useMemo } from "react";
import type { SortType } from "../types/filter";
import type { DetailPerformance } from "@classic-hub/shared/types/client";

const useSortedPerformances = (
  performances: DetailPerformance[],
  sortBy: SortType,
) => {
  const sortedPerformances = useMemo(() => {
    if (sortBy === "alphabetical") {
      return [...performances].sort((a, b) => a.title.localeCompare(b.title));
    }
    if (sortBy === "price-high") {
      return [...performances].sort((a, b) => b.maxPrice - a.maxPrice);
    }
    if (sortBy === "price-low") {
      return [...performances].sort((a, b) => a.minPrice - b.minPrice);
    }
    // 기본값은 공연임박순
    return [...performances].sort(
      (a, b) =>
        Number(a.endDate.replaceAll(".", "")) -
        Number(b.endDate.replaceAll(".", "")),
    );
  }, [sortBy, performances]);

  return sortedPerformances;
};

export default useSortedPerformances;