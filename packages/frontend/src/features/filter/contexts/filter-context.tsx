// 검색 결과 필터의 상태를 관리(열림/닫힘, 정렬 조건, 선택 지역 및 공연장)

import { createContext, useContext, useState } from "react";
import type { Filter } from "../types/filter";
import { useResult } from "@/features/performance/contexts/result-context";
import useFilteredPerformances from "../hooks/useFilteredPerformances";
import type { ResultPerformance } from "@classic-hub/shared/types/client";

interface FilterUIContextType {
  filterValue: Filter;
  filteredPerformances: Array<ResultPerformance>;
  isOpen: boolean;
  openedRegion: string | null;
  open: () => void;
  close: () => void;
  reset: () => void;
  changeFilterValue: (value: Partial<Filter>) => void;
  handleRegionOpen: (region: string) => void;
  handleVenueSelect: (venueId: string) => void;
}

const FilterUIContext = createContext<FilterUIContextType | null>(null);

export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [filterValue, setFilterValue] = useState<Filter>({
    sortBy: "imminent",
    // venue는 여러 개일 수 있으므로 배열로 관리
    selectedVenues: [],
  });
  const [isOpen, setIsOpen] = useState(true);
  const [openedRegion, setOpenedRegion] = useState<string | null>(null); // 지역 아코디언 토글

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const changeFilterValue = (value: Partial<Filter>) => {
    setFilterValue((prev) => ({ ...prev, ...value }));
  };
  const reset = () => {
    setOpenedRegion(null);
    changeFilterValue({ sortBy: "imminent", selectedVenues: [] }); // 기본값으로 초기화
  };

  const handleRegionOpen = (region: string) => {
    // 이미 region이 선택된 경우, selectedRegion을 null로(아코디언 축소)
    if (openedRegion === region) {
      setOpenedRegion(null);
    } else {
      // region이 선택되지 않은 경우, 선택
      setOpenedRegion(region);
    }
  };

  // 공연장 토글 (다중 선택 가능)
  const handleVenueSelect = (venueId: string) => {
    console.log(`venueId: ${venueId}`);
    const newVenues: string[] = [];
    const venues = filterValue.selectedVenues;

    if (venues.includes(venueId)) {
      // 이미 있으면 걔만 빼고 다시 추가
      venues.filter((v) => v !== venueId).forEach((v) => newVenues.push(v));
    } else {
      // 없으면 기존꺼 + 새거 추가
      [...venues, venueId].forEach((v) => newVenues.push(v));
    }

    changeFilterValue({ selectedVenues: newVenues });
  };
  console.log(`selectedVenues: ${JSON.stringify(filterValue.selectedVenues)}`);

  const { allPerformances } = useResult();
  const filteredPerformances = useFilteredPerformances(
    allPerformances,
    filterValue,
  );

  return (
    <FilterUIContext.Provider
      value={{
        filteredPerformances,
        filterValue,
        changeFilterValue,
        isOpen,
        openedRegion,
        open,
        close,
        reset,
        handleRegionOpen,
        handleVenueSelect,
      }}
    >
      {children}
    </FilterUIContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useFilter = () => {
  const context = useContext(FilterUIContext);
  if (!context)
    throw new Error("useFilterUI must be used within FilterUIProvider");
  return context;
};
