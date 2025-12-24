import type { Region } from "./FilterMobile";
import { ChevronDown, ChevronUp, Check } from "lucide-react";

interface LocationHallProps {
  regionArray: Region[];
  expandedRegion: string | null;
  selectedVenues: string[];
  onToggleRegion: (regionId: string) => void;
  onToggleVenue: (venueId: string) => void;
}

const LocationHall = ({
  regionArray,
  expandedRegion,
  selectedVenues,
  onToggleRegion,
  onToggleVenue,
}: LocationHallProps) => {
  return (
    <section>
      <h3 className="text-sm font-semibold text-gray-800 mb-3">
        지역 · 공연장
      </h3>
      <div className="border border-gray-200 rounded-xl divide-y divide-gray-100 overflow-hidden">
        {regionArray.map((region) => {
          const isExpanded = expandedRegion === region.id;
          // 해당 지역 내 선택된 공연장 개수 계산 (UI 표시용)
          const selectedInRegion = region.venues.filter((v) =>
            selectedVenues.includes(v.id)
          ).length;

          return (
            <div key={region.id} className="bg-white">
              {/* Region Header (Click to Expand) */}
              <button
                onClick={() => onToggleRegion(region.id)}
                className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`text-base ${
                      isExpanded || selectedInRegion > 0
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
                  {selectedInRegion > 0 && (
                    <span className="text-xs font-bold text-[#cc0000] bg-red-50 px-2 py-0.5 rounded-full">
                      {selectedInRegion}개 선택됨
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
                    const isSelected = selectedVenues.includes(venue.id);
                    return (
                      <div
                        key={venue.id}
                        onClick={() => onToggleVenue(venue.id)}
                        className="flex items-center justify-between cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          {/* Custom Checkbox */}
                          <div
                            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors
                                  ${
                                    isSelected
                                      ? "bg-[#cc0000] border-[#cc0000]"
                                      : "bg-white border-gray-300"
                                  }`}
                          >
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-white" />
                            )}
                          </div>
                          <span
                            className={`text-sm ${
                              isSelected
                                ? "text-gray-900 font-medium"
                                : "text-gray-600"
                            }`}
                          >
                            {venue.name}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {venue.count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default LocationHall;
