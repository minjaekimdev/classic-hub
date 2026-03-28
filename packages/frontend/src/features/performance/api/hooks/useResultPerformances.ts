import { useQuery } from "@tanstack/react-query";
import { getResultPerformances } from "../fetchers/getResultPerformances";
import mapToResult from "../mappers/mapToResult";
import type { QueryParams } from "@/features/filter/types/filter";

const useResultPerformances = (params: QueryParams) => {
  return useQuery({
    queryKey: ["performance", "result", params],
    queryFn: () => getResultPerformances(params),
    select: (data) => data.map(mapToResult),
  });
};

export default useResultPerformances;
