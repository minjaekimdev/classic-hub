import { X } from "lucide-react";
import LocationSelector from "../shared/FilterLocationSelector";
import SortSelector from "../shared/FilterSortSelector";
import { useFilter } from "../../contexts/filter-context";
import { BottomSheetWrapper } from "@/app/providers/bottom-sheet/BottomSheetWrapper";
import { useBottomSheet } from "@/app/providers/bottom-sheet/useBottomSheet";

const FilterBottomSheet = () => {
  const { reset, filteredPerformances } = useFilter();
  const { closeBottomSheet } = useBottomSheet();

  return (
    <BottomSheetWrapper>
      {/* Bottom Sheet Container */}
      <div
        className="relative h-full flex flex-col"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-lg font-bold text-gray-900">필터 </h2>
          {/* 닫기 버튼(X) */}
          <button
            onClick={closeBottomSheet}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {filteredPerformances.length > 0 && (
          <div className="flex-1 space-y-8 overflow-y-auto p-5 pb-24">
            {/* 2. 정렬 카테고리 */}
            <SortSelector />
            {/* 3. 지역 · 공연장 카테고리 */}
            <LocationSelector />
          </div>
        )}

        {/* Footer (Sticky) */}
        <div className="absolute bottom-0 w-full safe-area-bottom flex items-center gap-3 border-t border-gray-100 bg-white px-5 py-4">
          <button
            onClick={reset}
            className="flex items-center justify-center px-4 py-3.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-800"
          >
            <span className="mr-1">↺</span> 초기화
          </button>
          <button
            onClick={closeBottomSheet}
            className="flex-1 rounded-xl bg-[#cc0000] py-3.5 text-base font-bold text-white shadow-sm transition-all hover:bg-[#a30000] active:scale-[0.98]"
          >
            결과 보기 ({filteredPerformances.length})
          </button>
        </div>
      </div>
    </BottomSheetWrapper>
  );
};

export default FilterBottomSheet;
