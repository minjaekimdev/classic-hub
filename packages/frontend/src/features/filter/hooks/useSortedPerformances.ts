import { useMemo } from "react";
import type { SortType } from "../types/filter";
import type { DetailPerformance } from "@classic-hub/shared/types/client";

const useSortedPerformances = (
  performances: DetailPerformance[],
  sortBy: SortType,
) => {
  const sortedPerformances = useMemo(() => {
    const list = [...performances];
    if (sortBy === "alphabetical") {
      return list.sort((a, b) => a.title.localeCompare(b.title));
    }
    if (sortBy === "price-high") {
      return list.sort((a, b) => {
        if (!a.maxPrice && b.maxPrice) return 1;
        if (a.maxPrice && !b.maxPrice) return -1;
        if (!a.maxPrice && !b.maxPrice) return 0;

        // minPrice, maxPrice에 들어올 수 있는 값은 number 혹은 null임이 자명함
        return b.maxPrice! - a.maxPrice!;
      });
    }
    if (sortBy === "price-low") {
      return list.sort((a, b) => {
        if (!a.minPrice && b.minPrice) return 1;
        if (a.minPrice && !b.minPrice) return -1;
        if (!a.minPrice && !b.minPrice) return 0;

        return a.minPrice! - b.minPrice!;
      });
    }
    // 기본값은 공연임박순
    return list.sort(
      (a, b) =>
        Number(a.endDate.replaceAll(".", "")) -
        Number(b.endDate.replaceAll(".", "")),
    );
  }, [sortBy, performances]);

  return sortedPerformances;
};

export default useSortedPerformances;
