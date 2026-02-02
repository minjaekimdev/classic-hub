import { useState } from "react";

export type SortType = "imminent" | "price-low" | "price-high" | "alphabetical";

const useFilter = () => {
  // --- States ---
  const [sortBy, setSortBy] = useState<SortType>("imminent"); // 정렬 순서(기본값: 공연임박순)
  const [selectedArea, setSelectedArea] = useState<string | null>(null); // 선택된 지역
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
  // --- Handlers ---

  // 정렬 변경
  const changeSort = (id: SortType) => {
    setSortBy(id);
  };

  // 지역 아코디언 토글
  const toggleRegion = (regionId: string) => {
    // 이미 해당 regionId의 아코디언이 열려있다면 null로 닫기, 닫혀있었다면 regionId로 열기
    setSelectedArea((prev) => (prev === regionId ? null : regionId));
  };

  // 공연장 선택 토글
  const toggleVenue = (venueId: string) => {
    setSelectedVenues(
      (prev) =>
        prev.includes(venueId)
          ? prev.filter((id) => id !== venueId) // selectedVenues에 venue가 이미 존재한다면 클릭한 것만 빼고 나머지는 그대로 유지
          : [...prev, venueId], // 아니라면 클릭된 venueId 추가
    );
  };

  // 4. 초기화 로직
  const reset = () => {
    setSortBy("imminent");
    setSelectedVenues([]);
    setSelectedArea(null);
  };

  return {
    sortBy,
    selectedArea,
    selectedVenues,
    changeSort,
    toggleRegion,
    toggleVenue,
    reset,
  };
};

export default useFilter;
