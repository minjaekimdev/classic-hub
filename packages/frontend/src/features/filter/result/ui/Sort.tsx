import type { SortType } from "../hooks/useResultFilter";
import CategoryHeader from "./CategoryHeader";
import CategoryLayout from "./CategoryLayout";

const SORT_MAP: Record<SortType, string> = {
  "imminent": "공연임박순",
  "price-low": "낮은가격순",
  "price-high": "높은가격순",
  "alphabetical": "가나다순"
}

interface SortProps {
  selectedSort: string;
  handleSortChange: (id: SortType) => void;
}
const Sort = ({ selectedSort, handleSortChange }: SortProps) => {
  return (
    <CategoryLayout>
      <CategoryHeader text="정렬" />
      <div className="flex flex-wrap gap-2">
        {Object.entries(SORT_MAP).map(([key, value]) => (
          <button
            key={key}
            onClick={() => handleSortChange(key as SortType)}
            className={`px-3 py-2 rounded-full text-sm font-medium transition-colors border
                    ${
                      selectedSort === key
                        ? "bg-[#cc0000] border-[#cc0000] text-white shadow-sm"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
          >
            {value}
          </button>
        ))}
      </div>
    </CategoryLayout>
  );
};

export default Sort;
