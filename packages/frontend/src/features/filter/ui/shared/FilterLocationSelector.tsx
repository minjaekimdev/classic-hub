import CategoryLayout from "./FilterCategoryLayout";
import locationIcon from "@shared/assets/icons/location-black.svg";
import CategoryHeader from "./FilterCategoryHeader";
import RegionItem from "./FilterRegionItem";
import { useFilterParams } from "../../hooks/useFilterParams";
import { useState } from "react";
import { useResult } from "@/features/performance/contexts/result-context";
import useResultVenue from "../../hooks/use-result-venue";

const FilterLocationSelector = () => {
  const { filters } = useFilterParams();
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  
  const performances = useResult();
  const venues = useResultVenue(performances);

  const handleRegionToggle = (region: string) => {
    // 이미 region이 선택된 경우, selectedRegion을 null로(아코디언 축소)
    if (selectedRegion === region) {
      setSelectedRegion(null);
    } else {
      // region이 선택되지 않은 경우, 선택
      setSelectedRegion(region);
    }
  };

  return (
    <CategoryLayout>
      <CategoryHeader iconSrc={locationIcon} text="지역 · 공연장" />
      <div className="border border-gray-200 rounded-xl divide-y divide-gray-100 overflow-hidden">
        {venues.map((region) => {
          // 해당 지역 내 선택된 공연장 개수 계산 (UI 표시용)
          const selectedVenuesCount = region.venues.filter((v) =>
            filters.selectedVenues.includes(v.name),
          ).length;

          return (
            <RegionItem
              key={region.name}
              region={region}
              selectedRegion={selectedRegion}
              selectedVenuesCount={selectedVenuesCount}
              handleRegionToggle={handleRegionToggle}
            />
          );
        })}
      </div>
    </CategoryLayout>
  );
};

export default FilterLocationSelector;
