import type { SortType } from "@/features/filter/types/filter";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

const useQueryParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(
    () => ({
      keyword: searchParams.get("keyword"),
      location: searchParams.get("location"),
      minPrice: searchParams.get("min_price"),
      maxPrice: searchParams.get("max_price"),
      startDate: searchParams.get("start_date"),
      endDate: searchParams.get("end_date"),
      sortBy: (searchParams.get("sort_by") as SortType) || "imminent",
      // venue는 여러 개일 수 있으므로 배열로 관리
      selectedVenues: searchParams.getAll("venue"),
    }),
    [searchParams],
  );

  return {
    filters,
    searchParams,
    setSearchParams,
  };
};

export default useQueryParams;
