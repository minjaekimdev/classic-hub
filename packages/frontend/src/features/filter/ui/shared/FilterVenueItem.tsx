import { Check } from "lucide-react";
import type { Venue } from "../../types/filter";
import { useFilterParams } from "../../hooks/useFilterParams";

const FilterVenueItem = ({ venue }: { venue: Venue }) => {
  const { filters, handleVenueToggle } = useFilterParams();
  const isSelected = filters.selectedVenues.includes(venue.name);
  const checkStyle = isSelected
    ? "bg-[#cc0000] border-[#cc0000]"
    : "bg-white border-gray-300";
  const textStyle = isSelected ? "text-gray-900 font-medium" : "text-gray-600";

  return (
    <div
      key={venue.name}
      onClick={() => handleVenueToggle(venue.name)}
      className="flex items-center justify-between cursor-pointer group"
    >
      <div className="flex items-center gap-3">
        {/* Custom Checkbox */}
        <div
          className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${checkStyle}`}
        >
          {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
        </div>
        <span className={`text-sm ${textStyle}`}>{venue.name}</span>
      </div>
      <span className="text-xs text-gray-400">{venue.count}</span>
    </div>
  );
};

export default FilterVenueItem;
