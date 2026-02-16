import noteIcon from "@shared/assets/icons/musical-note-red.svg";
import filterIcon from "@shared/assets/icons/filter-black.svg";
import Sort from "../shared/FilterSortSelector";
import CategoryHeader from "../shared/FilterCategoryHeader";
import LocationSelector from "../shared/FilterLocationSelector";
import { useFilterParams } from "../../hooks/useFilterParams";
import { useFilterUI } from "../../contexts/FilterUIContext";

const FilterHeader = () => {
  const { resetFilters } = useFilterParams();
  return (
    <div className="flex justify-between">
      <CategoryHeader iconSrc={filterIcon} text="필터" />
      <button
        className="flex items-center h-7 px-[0.66rem] text-dark text-[0.77rem]/[1.09rem]"
        onClick={resetFilters}
      >
        초기화
      </button>
    </div>
  );
};

const Summary = () => {
  return (
    <div className="flex flex-col gap-[0.44rem] rounded-main bg-[#f9fafb] px-[0.88rem] pt-[0.87rem] pb-[0.37rem]">
      <CategoryHeader iconSrc={noteIcon} text="검색 결과" />
      <span className="text-main text-[1.31rem]/[1.75rem] font-bold">13개</span>
      <span className="text-[#6a7282] text-[0.77rem]/[1.09rem]">
        클래식 공연
      </span>
    </div>
  );
};

const FilterDesktop = () => {
  const { isOpen } = useFilterUI();
  return (
    <>
      {isOpen && (
        <div className="shrink-0 flex flex-col gap-[1.31rem] border-l border-[rgba(0,0,0,0.1)] bg-white p-[1.31rem] w-70 h-view-minus-header overflow-y-auto">
          <FilterHeader />
          {/* 검색된 공연 개수가 보여지는 영역 */}
          <Summary />
          {/* 구분선 */}
          <div className="bg-[rgba(0,0,0,0.1)] h-[0.06rem]"></div>
          <Sort />
          <LocationSelector />
        </div>
      )}
    </>
  );
};

export default FilterDesktop;
