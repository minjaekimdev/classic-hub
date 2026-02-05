import { SORT_MAP } from "../../constants/mock-region";
import { useFilterParams } from "../../hooks/useFilterParams";
import type { SortType } from "../../types/filter";
import CategoryHeader from "./FilterCategoryHeader";
import CategoryLayout from "./FilterCategoryLayout";

const FilterSortSelector = () => {
  const { filters, handleSortChange } = useFilterParams();
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
