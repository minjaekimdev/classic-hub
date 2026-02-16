import { ChevronDown, ChevronUp } from "lucide-react";
import VenueItem from "./FilterVenueItem";
import type { Region } from "../../types/filter";

interface FilterRegionItemProps {
  region: Region;
  selectedRegion: string | null;
  selectedVenuesCount: number;
  handleRegionToggle: (region: string) => void;
}

const FilterRegionItem = ({
  region,
  selectedRegion,
  selectedVenuesCount,
  handleRegionToggle,
}: FilterRegionItemProps) => {
  const isExpanded = selectedRegion === region.name;
  return (
    <div className="bg-white">
      {/* Region Header (Click to Expand) */}
      <button
        onClick={() => handleRegionToggle(region.name)}
        className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span
            className={`text-base ${
              isExpanded || selectedVenuesCount > 0
                ? "font-bold text-gray-900"
                : "text-gray-700"
            }`}
          >
            {region.name}
          </span>
          {/* 지역 합산 개수 표시 */}
          <span className="text-xs text-gray-400 font-medium">
            {region.totalCount}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {selectedVenuesCount > 0 && (
            <span className="text-xs font-bold text-[#cc0000] bg-red-50 px-2 py-0.5 rounded-full">
              {selectedVenuesCount}개 선택됨
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>

      {/* Venues List (Expanded) */}
      {isExpanded && (
        <div className="bg-gray-50 px-4 py-3 space-y-2">
          {region.venues.map((venue) => {
            return <VenueItem key={venue.name} venue={venue} />;
          })}
        </div>
      )}
    </div>
  );
};

export default FilterRegionItem;
