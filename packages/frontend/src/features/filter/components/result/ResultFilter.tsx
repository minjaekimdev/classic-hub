import { useState } from "react";
import CategoryItem from "./CategoryItem";
import CategoryHeader from "./CategoryHeader";
import locationIcon from "@shared/assets/icons/location-black.svg";
import noteIcon from "@shared/assets/icons/musical-note-red.svg";
import filterIcon from "@shared/assets/icons/filter-black.svg";
import RegionFilterAccordion from "./RegionFilterAccordion";

const sortCategoryItem = ["공연임박순", "낮은가격순", "높은가격순", "가나다순"];

interface ResultCountProps {
  count: number;
}

const ResultCount = ({ count }: ResultCountProps) => {
  return (
    <div className="flex flex-col gap-[0.44rem] rounded-[0.55rem] bg-[#f9fafb] px-[0.88rem] pt-[0.87rem] pb-[0.37rem]">
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

const SortCategory = () => {
  const [selected, setSelected] = useState("공연임박순");
  return (
    <div className="flex flex-col gap-[0.66rem]">
      <CategoryHeader text="정렬" />
      <div className="flex flex-col gap-[0.44rem]">
        {sortCategoryItem.map((item) => (
          <CategoryItem
            key={item}
            text={item}
            selected={selected}
            onSelect={(v: string) => setSelected(v)}
          />
        ))}
      </div>
    </div>
  );
};

export interface Hall {
  id: string;
  name: string;
  count: number;
}

export interface Region {
  id: string;
  name: string;
  totalCount: number;
  halls: Hall[];
}

const REGION_DATA: Region[] = [
  {
    id: "seoul",
    name: "서울",
    totalCount: 24,
    halls: [
      { id: "sac", name: "예술의전당", count: 9 },
      { id: "sejong", name: "세종문화회관", count: 5 },
      { id: "lotte", name: "롯데콘서트홀", count: 6 },
      { id: "kumho", name: "금호아트홀 연세", count: 4 },
    ],
  },
  {
    id: "gyeonggi",
    name: "경기",
    totalCount: 15,
    halls: [
      { id: "ggcf", name: "경기아트센터", count: 5 },
      { id: "aram", name: "고양아람누리", count: 4 },
      { id: "seongnam", name: "성남아트센터", count: 3 },
      { id: "poeun", name: "용인포은아트홀", count: 3 },
    ],
  },
  {
    id: "incheon",
    name: "인천",
    totalCount: 10,
    halls: [
      { id: "artcenter-incheon", name: "아트센터 인천", count: 5 },
      { id: "incheon-culture", name: "인천문화예술회관", count: 3 },
      { id: "tribowl", name: "트라이보울", count: 2 },
    ],
  },
  {
    id: "incheon",
    name: "인천",
    totalCount: 10,
    halls: [
      { id: "artcenter-incheon", name: "아트센터 인천", count: 5 },
      { id: "incheon-culture", name: "인천문화예술회관", count: 3 },
      { id: "tribowl", name: "트라이보울", count: 2 },
    ],
  },
  {
    id: "incheon",
    name: "인천",
    totalCount: 10,
    halls: [
      { id: "artcenter-incheon", name: "아트센터 인천", count: 5 },
      { id: "incheon-culture", name: "인천문화예술회관", count: 3 },
      { id: "tribowl", name: "트라이보울", count: 2 },
    ],
  },
];

const LocationCategory = ({ className }: { className?: string }) => {
  // 특정 지역의 공연장 클릭시 '전체' 선택 해제하기 위한 state
  const [locationSelected, setLocationSelected] = useState("전체");
  // 지역 아코디언 트리거 클릭할 때마다 다른 지역 아코디언 닫기 위한 state
  const [accordionSelected, setAccordionSelected] = useState<string | null>(
    null
  );
  // 선택된 공연장의 개수를 아코디언 트리거에 반영하기 위한 state
  const [hallSelected, setHallSelected] = useState<string | null>(null);

  const handleHallClick = (regionName: string, hallId: string) => {
    setLocationSelected(regionName);
    setHallSelected(hallId);
  };

  return (
    <div className={`flex flex-col gap-[0.66rem] ${className}`}>
      <CategoryHeader iconSrc={locationIcon} text="지역 · 공연장" />

      <CategoryItem
        text="전체"
        selected={locationSelected}
        onSelect={setLocationSelected}
      />
      <div className="flex flex-col gap-[0.44rem] overflow-y-auto">
        {REGION_DATA.map((item) => (
          <RegionFilterAccordion
            key={item.id}
            data={item}
            locationSelected={locationSelected}
            selected={accordionSelected}
            hallSelected={hallSelected}
            onRegionSelect={setAccordionSelected}
            onHallSelect={handleHallClick}
          />
        ))}
      </div>
    </div>
  );
};

// ResultFilter.tsx

const ResultFilter = () => {
  return (
    <div className="fixed left-0 bottom-0 z-50 flex flex-col rounded-t-[1.31rem] bg-white w-screen h-[90vh]">
      
      {/* 1. Header (완전 고정) */}
      <header className="flex-none px-[0.88rem] pt-[0.94rem] pb-[2.63rem]">
        <h3 className="text-[#0a0a0a] text-[1.09rem]/[1.64rem] font-semibold">
          필터 및 정렬
        </h3>
      </header>

      {/* 2. Main Content (고정되어야 함!) 
          - overflow-y-auto를 제거하고 overflow-hidden을 줍니다.
          - 이제 여기서 스크롤이 생기지 않습니다.
      */}
      <div className="flex-1 flex flex-col gap-[1.31rem] p-[0.88rem] overflow-hidden">
        
        {/* 고정된 상단 요소들 (flex-none) */}
        <div className="flex-none py-[0.22rem]">
          <CategoryHeader iconSrc={filterIcon} text="필터" />
        </div>
        <div className="flex-none">
          <ResultCount count={13} />
        </div>
        <div className="flex-none h-[0.06rem] bg-[rgba(0,0,0,0.1)]"></div>
        
        {/* 3. 정렬 & 지역 영역 (남은 공간 다 차지하기)
          - flex-1 min-h-0: 남은 높이를 모두 차지함
          - 모바일에서는 flex-col로 쌓고, 태블릿에선 grid로 배치
        */}
        <div className="flex-1 min-h-0 flex flex-col gap-[1.31rem] tablet:grid tablet:grid-cols-2">
          
          {/* 정렬 (고정, 스크롤 X) */}
          <div className="flex-none">
            <SortCategory />
          </div>

          {/* 지역 (여기에만 스크롤!) 
            - flex-1: 남은 공간(높이)을 모두 가져감
            - overflow-hidden: 내부 컴포넌트에게 스크롤 권한 위임
          */}
          <div className="flex-1 min-h-0 overflow-y-auto relative">
             {/* h-full을 줘서 부모 높이를 꽉 채우게 전달 */}
            <LocationCategory />
          </div>
        </div>
      </div>

      {/* 4. Footer (완전 고정) */}
      <footer className="flex-none p-[0.94rem]">
        <button className="flex justify-center items-center rounded-[0.42rem] bg-main w-full h-[2.19rem] text-white text-[0.77rem]/[1.09rem] font-medium">
          결과보기
        </button>
      </footer>
    </div>
  );
};

export default ResultFilter;
