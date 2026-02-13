import type { DetailPerformance } from "@classic-hub/shared/types/client";
import { fetchSearchResults } from "../fetchers/get-performance-result";
import { useEffect, useState } from "react";
import type { SearchFilters } from "../../types";

const useResultPerformance = (params: SearchFilters) => {
  const [performance, setPerformance] = useState<DetailPerformance[]>([]);
  const { keyword, location, minPrice, maxPrice, startDate, endDate } = params;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const performances = await fetchSearchResults({
          keyword,
          location,
          minPrice,
          maxPrice,
          startDate,
          endDate,
        });
        setPerformance(performances);
      } catch (error) {
        console.error("Failed to fetch result performances:", error);
      }
    };
    fetchData();
  }, [keyword, location, minPrice, maxPrice, startDate, endDate]);

  return performance;
};

export default useResultPerformance;
