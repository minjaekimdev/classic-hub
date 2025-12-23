import { useState } from "react";
import { X } from "lucide-react";
import LocationHall from "./LocationHall";

// 예시 데이터 타입 정의
type Venue = {
  id: string;
  name: string;
  count: number;
};

export type Region = {
  id: string;
  name: string;
  totalCount: number; // 해당 지역 공연장들의 합산 개수
  venues: Venue[];
};

// Mock Data (실제 데이터로 교체 필요)
const MOCK_REGIONS: Region[] = [
  {
    id: "seoul",
    name: "서울",
    totalCount: 120,
    venues: [
      { id: "sac", name: "예술의전당", count: 45 },
      { id: "lotte", name: "롯데콘서트홀", count: 30 },
      { id: "sejong", name: "세종문화회관", count: 25 },
      { id: "kumho", name: "금호아트홀", count: 20 },
    ],
  },
  {
    id: "gyeonggi",
    name: "경기/인천",
    totalCount: 45,
    venues: [
      { id: "seongnam", name: "성남아트센터", count: 15 },
      { id: "artgy", name: "경기아트센터", count: 30 },
    ],
  },
  {
    id: "busan",
    name: "부산",
    totalCount: 12,
    venues: [{ id: "busan_culture", name: "부산문화회관", count: 12 }],
  },
];

const SORT_OPTIONS = [
  { id: "imminent", label: "공연임박순" },
  { id: "price_asc", label: "낮은가격순" },
  { id: "price_desc", label: "높은가격순" },
  { id: "alphabet", label: "가나다순" },
];

interface FilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  totalResultCount: number; // 1. 검색된 공연 결과 개수
}

const FilterBottomSheet = ({
  isOpen,
  onClose,
  totalResultCount,
}: FilterBottomSheetProps) => {
  // --- States ---
  const [selectedSort, setSelectedSort] = useState<string>("imminent");
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null); // 아코디언 상태
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]); // 선택된 공연장 ID 목록

  if (!isOpen) return null;
  // --- Handlers ---

  // 정렬 변경
  const handleSortChange = (id: string) => {
    setSelectedSort(id);
  };

  // 지역 아코디언 토글
  const toggleRegion = (regionId: string) => {
    // 이미 해당 regionId의 아코디언이 열려있다면 null로 닫기, 닫혀있었다면 regionId로 열기
    setExpandedRegion((prev) => (prev === regionId ? null : regionId));
  };

  // 공연장 선택 토글
  const toggleVenue = (venueId: string) => {
    setSelectedVenues(
      (prev) =>
        prev.includes(venueId)
          ? prev.filter((id) => id !== venueId) // selectedVenues에 venue가 이미 존재한다면 클릭한 것만 빼고 나머지는 그대로 유지
          : [...prev, venueId] // 아니라면 클릭된 venueId 추가
    );
  };

  // 4. 초기화 로직
  const handleReset = () => {
    setSelectedSort("imminent");
    setSelectedVenues([]);
    setExpandedRegion(null);
  };

  // 5. 결과보기 (적용 및 닫기)
  const handleApply = () => {
    // 여기에 실제 필터 적용 로직(API 호출 등) 추가
    console.log({ selectedSort, selectedVenues });
    onClose();
  };

  return (
    <>
      {/* Backdrop, 화면 전체를 덮는 반투명 검정 레이어를 만듦 */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Bottom Sheet Container */}
      <div className="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-2xl shadow-xl max-h-[90vh] flex flex-col transition-transform duration-300 transform translate-y-0">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            필터 <span className="text-[#cc0000] ml-1">{totalResultCount}</span>
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
          <section>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">정렬</h3>
            <div className="flex flex-wrap gap-2">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSortChange(option.id)}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-colors border
                    ${
                      selectedSort === option.id
                        ? "bg-[#cc0000] border-[#cc0000] text-white shadow-sm"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </section>

          {/* 3. 지역 · 공연장 카테고리 */}
          <LocationHall
            regionArray={MOCK_REGIONS}
            expandedRegion={expandedRegion}
            selectedVenues={selectedVenues}
            onToggleRegion={toggleRegion}
            onToggleVenue={toggleVenue}
          />
          
        </div>

        {/* Footer (Sticky) */}
        <div className="flex items-center gap-3 px-5 py-4 border-t border-gray-100 bg-white safe-area-bottom">
          <button
            onClick={handleReset}
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
  );
};

export default FilterBottomSheet;
