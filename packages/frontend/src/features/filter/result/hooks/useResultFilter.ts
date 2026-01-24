import { useState } from "react";

const useResultFilter = () => {
  // --- States ---
  const [selectedSort, setSelectedSort] = useState<string>("imminent");
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null); // 아코디언 상태
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]); // 선택된 공연장 ID 목록

  // --- Handlers ---

  // 정렬 변경
  const handleSortChange = (id: string) => {
    setSelectedSort(id);
  };

  // 지역 아코디언 토글
  const toggleRegion = (regionId: string) => {
    // 이미 해당 regionId의 아코디언이 열려있다면 null로 닫기, 닫혀있었다면 regionId로 열기
    setExpandedRegion((prev) => (prev === regionId ? null : regionId));
  };

  // 공연장 선택 토글
  const toggleVenue = (venueId: string) => {
    setSelectedVenues(
      (prev) =>
        prev.includes(venueId)
          ? prev.filter((id) => id !== venueId) // selectedVenues에 venue가 이미 존재한다면 클릭한 것만 빼고 나머지는 그대로 유지
          : [...prev, venueId] // 아니라면 클릭된 venueId 추가
    );
  };

  // 4. 초기화 로직
  const handleReset = () => {
    setSelectedSort("imminent");
    setSelectedVenues([]);
    setExpandedRegion(null);
  };

  return {
    states: {
      selectedSort,
      expandedRegion,
      selectedVenues,
    },
    actions: {
      handleSortChange,
      toggleRegion,
      toggleVenue,
      handleReset,
    },
  };
};

export default useResultFilter;
