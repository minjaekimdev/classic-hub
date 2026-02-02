import { Check } from "lucide-react";
import type { Venue } from "../../types";

interface VenueItemProps {
  isSelected: boolean;
  onToggleVenue: (venueId: string) => void;
  venue: Venue;
}

const VenueItem = ({ isSelected, onToggleVenue, venue }: VenueItemProps) => {
  const checkStyle = isSelected
    ? "bg-[#cc0000] border-[#cc0000]"
    : "bg-white border-gray-300";
  const textStyle = isSelected ? "text-gray-900 font-medium" : "text-gray-600";
  return (
    <div
      key={venue.id}
      onClick={() => onToggleVenue(venue.id)}
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

export default VenueItem;