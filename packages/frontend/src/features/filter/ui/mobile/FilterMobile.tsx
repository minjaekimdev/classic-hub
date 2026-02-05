import { X } from "lucide-react";
import LocationSelector from "../shared/LocationSelector";
import SortSelector from "../shared/SortSelector";
import { useFilterParams } from "../../hooks/useFilterParams";

interface FilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  totalResultCount: number; // 1. 검색된 공연 결과 개수
}

const FilterMobile = ({
  isOpen,
  onClose,
  totalResultCount,
}: FilterBottomSheetProps) => {
  const { resetFilters } = useFilterParams();

  // 5. 결과보기 (적용 및 닫기)
  const handleApply = () => {
    // 여기에 실제 필터 적용 로직(API 호출 등) 추가
    // console.log({ selectedSort, selectedVenues });
    onClose();
  };

  return (
    <>
      {isOpen && (
        <>
          {/* Backdrop, 화면 전체를 덮는 반투명 검정 레이어를 만듦 */}
          <div
            className="fixed inset-0 bg-black/50 z-(--z-modal-overlay) transition-opacity"
            onClick={onClose}
          />

          {/* Bottom Sheet Container */}
          <div className="fixed bottom-0 left-0 right-0 bg-white z-(--z-modal) rounded-t-2xl shadow-xl max-h-[90vh] flex flex-col transition-transform duration-300 transform translate-y-0">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                필터{" "}
                <span className="text-[#cc0000] ml-1">{totalResultCount}</span>
              </h2>
              {/* 닫기 버튼(X) */}
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-8 pb-24">
              {/* 2. 정렬 카테고리 */}
              <SortSelector />
              {/* 3. 지역 · 공연장 카테고리 */}
              <LocationSelector />
            </div>

            {/* Footer (Sticky) */}
            <div className="flex items-center gap-3 px-5 py-4 border-t border-gray-100 bg-white safe-area-bottom">
              <button
                onClick={resetFilters}
                className="flex items-center justify-center px-4 py-3.5 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
              >
                <span className="mr-1">↺</span> 초기화
              </button>
              <button
                onClick={handleApply}
                className="flex-1 bg-[#cc0000] hover:bg-[#a30000] text-white text-base font-bold py-3.5 rounded-xl shadow-sm active:scale-[0.98] transition-all"
              >
                결과 보기 ({totalResultCount})
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default FilterMobile;
