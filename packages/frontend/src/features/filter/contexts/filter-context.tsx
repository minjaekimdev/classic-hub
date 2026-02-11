// 필터의 열고닫힘 상태만 전역적으로 관리
import useQueryParams from "@/shared/hooks/useParams";
import { createContext, useContext, useState } from "react";
import type { Filter, SortType } from "../types/filter";

interface FilterUIContextType {
  filters: Filter;
  isOpen: boolean;
  openedRegion: string | null;
  open: () => void;
  close: () => void;
  reset: () => void;
  handleRegionOpen: (region: string) => void;
  handleSortSelect: (sortBy: SortType) => void;
  handleVenueSelect: (venueId: string) => void;
  updateParams: (newParams: URLSearchParams) => void;
}

const FilterUIContext = createContext<FilterUIContextType | null>(null);

export const FilterProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(true); // 기본값은 닫힘 추천
  const [openedRegion, setOpenedRegion] = useState<string | null>(null);

  const { filters, searchParams, setSearchParams } = useQueryParams();

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const reset = () => {
    setOpenedRegion(null);
    setSearchParams({ sort_by: "imminent" }); // 기본값으로 초기화
  };

  // 2. URL을 업데이트하는 헬퍼 함수 (Write)
  const updateParams = (newParams: URLSearchParams) => {
    // 페이지를 1페이지로 리셋하거나 하는 부가 로직이 여기에 들어갈 수 있음
    setSearchParams(newParams);
  };

  // 정렬 변경
  const handleSortSelect = (sortBy: SortType) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sort_by", sortBy);
    updateParams(newParams);
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
    const newParams = new URLSearchParams(searchParams);
    const venues = newParams.getAll("venue");

    // 기존 venue들을 싹 지우고
    newParams.delete("venue");

    if (venues.includes(venueId)) {
      // 이미 있으면 걔만 빼고 다시 추가
      venues
        .filter((v) => v !== venueId)
        .forEach((v) => newParams.append("venue", v));
    } else {
      // 없으면 기존꺼 + 새거 추가
      [...venues, venueId].forEach((v) => newParams.append("venue", v));
    }

    updateParams(newParams);
  };

  return (
    <FilterUIContext.Provider
      value={{
        filters,
        isOpen,
        openedRegion,
        open,
        close,
        reset,
        handleRegionOpen,
        handleSortSelect,
        handleVenueSelect,
        updateParams,
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
