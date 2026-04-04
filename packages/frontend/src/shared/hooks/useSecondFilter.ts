import type { Filter } from "@/features/filter/types/filter";
import { useState } from "react";

const useSecondFilter = () => {
  const [filterValue, setFilterValue] = useState<Filter>({
    sortBy: "imminent",
    // venue는 여러 개일 수 있으므로 배열로 관리
    selectedVenues: []
  });

  const changeFilterValue = (value: Partial<Filter>) => {
    setFilterValue((prev) => ({ ...prev, value }));
  };

  return {
    filterValue,
    changeFilterValue,
  };
};

export default useSecondFilter;
