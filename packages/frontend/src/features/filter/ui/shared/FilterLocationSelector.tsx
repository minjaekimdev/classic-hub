import CategoryLayout from "./FilterCategoryLayout";
import locationIcon from "@shared/assets/icons/location-black.svg";
import CategoryHeader from "./FilterCategoryHeader";
import RegionItem from "./FilterRegionItem";
import { useResult } from "@/features/performance/contexts/result-context";
import useResultVenue from "../../hooks/use-result-venue";
import { useFilter } from "../../contexts/filter-context";

const FilterLocationSelector = () => {
  const { filters, openedRegion, handleRegionOpen } = useFilter();
  const { allPerformances } = useResult();
  const venues = useResultVenue(allPerformances);

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
              selectedRegion={openedRegion}
              selectedVenuesCount={selectedVenuesCount}
              handleRegionToggle={handleRegionOpen}
            />
          );
        })}
      </div>
    </CategoryLayout>
  );
};

export default FilterLocationSelector;
