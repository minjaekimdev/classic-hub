import type { SearchFilters } from "../../types";
import { useQuery } from "@tanstack/react-query";
import { getResultPerformances } from "../fetchers/get-performance-result";
import mapToPerformanceDetail from "../mappers/performance-detail.mapper";

const useResultPerformances = (params: SearchFilters) => {
  return useQuery({
    queryKey: ["performance", "result", params],
    queryFn: () => getResultPerformances(params),
    select: (item) => item.map(mapToPerformanceDetail)
  })
};

export default useResultPerformances;
