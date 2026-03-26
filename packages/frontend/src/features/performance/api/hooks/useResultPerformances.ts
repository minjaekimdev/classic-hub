import type { SearchFilters } from "../../types";
import { useQuery } from "@tanstack/react-query";
import { getResultPerformances } from "../fetchers/getResultPerformances";
import mapToResult from "../mappers/mapToResult";

const useResultPerformances = (params: SearchFilters) => {
  return useQuery({
    queryKey: ["performance", "result", params],
    queryFn: () => getResultPerformances(params),
    select: (data) => data.map(mapToResult),
  });
};

export default useResultPerformances;
