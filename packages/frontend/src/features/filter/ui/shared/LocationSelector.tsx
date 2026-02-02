import CategoryLayout from "./CategoryLayout";
import locationIcon from "@shared/assets/icons/location-black.svg";
import CategoryHeader from "./CategoryHeader";
import type { Region } from "../../types";
import RegionItem from "./RegionItem";

interface LocationHallProps {
  regionArray: Region[];
  expandedRegion: string | null;
  selectedVenues: string[];
  onToggleRegion: (regionId: string) => void;
  onToggleVenue: (venueId: string) => void;
}

const LocationSelector = ({
  regionArray,
  expandedRegion,
  selectedVenues,
  onToggleRegion,
  onToggleVenue,
}: LocationHallProps) => {
  return (
    <CategoryLayout>
      <CategoryHeader iconSrc={locationIcon} text="지역 · 공연장" />
      <div className="border border-gray-200 rounded-xl divide-y divide-gray-100 overflow-hidden">
        {regionArray.map((region) => {
          // 해당 지역 내 선택된 공연장 개수 계산 (UI 표시용)
          const selectedInRegion = region.venues.filter((v) =>
            selectedVenues.includes(v.id),
          ).length;

          return (
            <RegionItem
              region={region}
              isExpanded={expandedRegion === region.id}
              selectedInRegion={selectedInRegion}
              selectedVenues={selectedVenues}
              onToggleRegion={onToggleRegion}
              onToggleVenue={onToggleVenue}
            />
          );
        })}
      </div>
    </CategoryLayout>
  );
};

export default LocationSelector;
