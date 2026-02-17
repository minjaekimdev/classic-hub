import { useQuery } from "@tanstack/react-query";
import { getWeekendPerformances } from "./getWeekendPerformances";
import { mapToHomeWeekend } from "../mappers/mapToHomeWeekend";

export const useWeekendPerformances = () => {
  return useQuery({
    queryKey: ["performance", "result", "weekend"],
    queryFn: getWeekendPerformances,
    select: (data) => data.map(mapToHomeWeekend),
  });
};
