import noteIcon from "@shared/assets/icons/musical-note-red.svg";
import filterIcon from "@shared/assets/icons/filter-black.svg";
import Sort from "../shared/FilterSortSelector";
import CategoryHeader from "../shared/FilterCategoryHeader";
import LocationSelector from "../shared/FilterLocationSelector";
import { useFilter } from "../../contexts/filter-context";
import { useResult } from "@/features/performance/contexts/result-context";

const FilterHeader = () => {
  const { reset } = useFilter();
  return (
    <div className="flex justify-between">
      <CategoryHeader iconSrc={filterIcon} text="필터" />
      <button
        className="text-dark flex h-7 items-center px-066 text-[0.77rem]/[1.09rem]"
        onClick={reset}
      >
        초기화
      </button>
    </div>
  );
};

const Summary = () => {
  const { filteredPerformances } = useResult();
  return (
    <div className="rounded-main flex flex-col gap-044 bg-light px-088 pt-[0.87rem] pb-[0.37rem]">
      <CategoryHeader iconSrc={noteIcon} text="검색 결과" />
      <span className="text-main text-[1.31rem]/[1.75rem] font-bold">
        {filteredPerformances.length}개
      </span>
      <span className="text-[0.77rem]/[1.09rem] text-[#6a7282]">
        클래식 공연
      </span>
    </div>
  );
};

const FilterDesktop = () => {
  const { isOpen } = useFilter();
  const { allPerformances } = useResult();
  return (
    <>
      {isOpen && (
        <div className="top-desktop-header-shrinked h-main-desktop sticky flex w-70 shrink-0 flex-col gap-[1.31rem] overflow-y-auto border-l border-[rgba(0,0,0,0.1)] bg-white p-[1.31rem]">
          <FilterHeader />
          {/* 검색된 공연 개수가 보여지는 영역 */}
          <Summary />
          {/* 구분선 */}
          <div className="h-[0.06rem] bg-[rgba(0,0,0,0.1)]"></div>
          {allPerformances && allPerformances.length > 0 && (
            <>
              <Sort />
              <LocationSelector />
            </>
          )}
        </div>
      )}
    </>
  );
};

export default FilterDesktop;
