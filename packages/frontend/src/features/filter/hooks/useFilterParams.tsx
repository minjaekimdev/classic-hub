import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { SortType } from "../types";

export const useFilterParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. URL에서 값을 읽어와 객체로 변환 (Read)
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

  // 2. URL을 업데이트하는 헬퍼 함수 (Write)
  const updateParams = (newParams: URLSearchParams) => {
    // 페이지를 1페이지로 리셋하거나 하는 부가 로직이 여기에 들어갈 수 있음
    setSearchParams(newParams);
  };

  // 정렬 변경
  const handleSortChange = (sortBy: SortType) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sort_by", sortBy);
    updateParams(newParams);
  };

  // 공연장 토글 (다중 선택 가능)
  const handleVenueToggle = (venueId: string) => {
    const newParams = new URLSearchParams(searchParams);
    const venues = newParams.getAll("venue");

    // 기존 venue들을 싹 지우고
    newParams.delete("venue");

    if (venues.includes(venueId)) {
        // 이미 있으면 걔만 빼고 다시 추가
        venues.filter(v => v !== venueId).forEach(v => newParams.append("venue", v));
    } else {
        // 없으면 기존꺼 + 새거 추가
        [...venues, venueId].forEach(v => newParams.append("venue", v));
    }
    
    updateParams(newParams);
  };

  const resetFilters = () => {
    setSearchParams({ sort_by: "imminent" }); // 기본값으로 초기화
  };

  return {
    filters,
    handleSortChange,
    handleVenueToggle,
    resetFilters,
  };
};