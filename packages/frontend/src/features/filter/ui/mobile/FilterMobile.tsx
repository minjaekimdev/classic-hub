import { X } from "lucide-react";
import LocationSelector from "../shared/FilterLocationSelector";
import SortSelector from "../shared/FilterSortSelector";
import { useFilter } from "../../contexts/filter-context";
import { useBottomSheet } from "@/shared/ui/bottom-sheet/BottomSheet";

const FilterMobile = () => {
  const { reset } = useFilter();
  const { close } = useBottomSheet();
  const { filteredPerformances } = useFilter();

  // 5. 결과보기 (적용 및 닫기)
  const handleApply = () => {
    // 여기에 실제 필터 적용 로직(API 호출 등) 추가
    // console.log({ selectedSort, selectedVenues });
    close();
  };

  return (
    <>
      {/* Backdrop, 화면 전체를 덮는 반투명 검정 레이어를 만듦 */}
      <div
        className="fixed inset-0 z-(--z-modal-overlay) bg-black/50 transition-opacity"
        onClick={close}
      />

      {/* Bottom Sheet Container */}
      <div
        className="fixed right-0 bottom-0 left-0 z-(--z-modal) flex max-h-[90vh] translate-y-0 transform flex-col rounded-t-2xl bg-white shadow-xl transition-transform duration-300"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-lg font-bold text-gray-900">
            필터{" "}
            {/* <span className="text-[#cc0000] ml-1">{totalResultCount}</span> */}
          </h2>
          {/* 닫기 버튼(X) */}
          <button
            onClick={close}
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
        <div className="safe-area-bottom flex items-center gap-3 border-t border-gray-100 bg-white px-5 py-4">
          <button
            onClick={reset}
            className="flex items-center justify-center px-4 py-3.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-800"
          >
            <span className="mr-1">↺</span> 초기화
          </button>
          <button
            onClick={handleApply}
            className="flex-1 rounded-xl bg-[#cc0000] py-3.5 text-base font-bold text-white shadow-sm transition-all hover:bg-[#a30000] active:scale-[0.98]"
          >
            결과 보기 ({filteredPerformances.length})
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterMobile;
