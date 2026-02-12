import { SORT_MAP } from "../../constants/name-mapper";
import { useFilter } from "../../contexts/filter-context";
import type { SortType } from "../../types/filter";
import CategoryHeader from "./FilterCategoryHeader";
import CategoryLayout from "./FilterCategoryLayout";

const FilterSortSelector = () => {
  const { filters, handleSortSelect } = useFilter();
  return (
    <CategoryLayout>
      <CategoryHeader text="정렬" />
      <div className="flex flex-wrap gap-2">
        {Object.entries(SORT_MAP).map(([key, value]) => (
          <button
            key={key}
            onClick={() => handleSortSelect(key as SortType)}
            className={`px-3 py-2 rounded-full text-sm font-medium transition-colors border
                    ${
                      filters.sortBy === key
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

export default FilterSortSelector;
