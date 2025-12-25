import noteIcon from "@shared/assets/icons/musical-note-red.svg";
import filterIcon from "@shared/assets/icons/filter-black.svg";
import CategoryHeader from "./CategoryHeader";
import Sort from "./Sort";
import type useResultFilter from "../../hooks/useResultFilter";
import LocationHall from "./LocationHall";
import type { Region } from "./ResultFilterMobile";

interface ResultCountProps {
  count: number;
}

const ResultCount = ({ count }: ResultCountProps) => {
  return (
    <div className="flex flex-col gap-[0.44rem] rounded-main bg-[#f9fafb] px-[0.88rem] pt-[0.87rem] pb-[0.37rem]">
      <CategoryHeader iconSrc={noteIcon} text="검색 결과" />
      <span className="text-main text-[1.31rem]/[1.75rem] font-bold">
        {count}개
      </span>
      <span className="text-[#6a7282] text-[0.77rem]/[1.09rem]">
        클래식 공연
      </span>
    </div>
  );
};

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

interface ResultFilterDesktopProps {
  isOpen: boolean;
  filter: ReturnType<typeof useResultFilter>;
}
const ResultFilterDesktop = ({ isOpen, filter }: ResultFilterDesktopProps) => {
  return (
    <>
      {isOpen && (
        <div className="flex flex-col gap-[1.31rem] p-[1.31rem] w-70">
          <div className="flex justify-between">
            <CategoryHeader iconSrc={filterIcon} text="필터" />
            <button className="flex items-center h-7 px-[0.66rem] text-dark text-[0.77rem]/[1.09rem]">
              초기화
            </button>
          </div>
          <ResultCount count={13} />
          {/* 구분선 */}
          <div className="bg-[rgba(0,0,0,0.1)] h-[0.06rem]"></div>
          <Sort
            selectedSort={filter.states.selectedSort}
            handleSortChange={filter.actions.handleSortChange}
          />
          <LocationHall
            regionArray={MOCK_REGIONS}
            expandedRegion={filter.states.expandedRegion}
            selectedVenues={filter.states.selectedVenues}
            onToggleRegion={filter.actions.toggleRegion}
            onToggleVenue={filter.actions.toggleVenue}
          />
        </div>
      )}
    </>
  );
};

export default ResultFilterDesktop;
