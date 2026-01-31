import { createContext, useState } from "react";
import Header from "../layout/desktop/HeaderDesktop";
import Footer from "@/layout/shared/Footer";
import Modal from "@/shared/ui/modals/Modal";
import filterIcon from "@shared/assets/icons/filter-dark.svg";
import closeIcon from "@shared/assets/icons/close-white.svg";
import ResultFilterMobile from "@/features/filter/result/components/ResultFilterMobile";
import ResultFilterDesktop from "@/features/filter/result/components/ResultFilterDesktop";
import ResultAlbumItem from "@/features/performance/components/desktop/ResultPerformanceAlbumCard";
import useBreakpoint from "@/shared/hooks/useBreakpoint";
import PerformanceListCard from "@/features/performance/components/mobile/PerformanceListCard";
import type {
  DetailPerformance,
  PerformanceSummary,
} from "@classic-hub/shared/types/client";
import { useSearchParams } from "react-router-dom";

// 헤더의 Search Filter로 1차 검색된 결과물
const MOCKUP_DATA: PerformanceSummary[] = [
  {
    id: "PF281871",
    title: "이민성 피아노 리사이틀: DRAMA",
    artist: "이민성", // 제목에서 유추
    poster:
      "http://www.kopis.or.kr/upload/pfmPoster/PF_PF281871_251219_111529.gif",
    period: "2025.12.21",
    venue: "금호아트홀 연세",
    time: "오후 8시 00분", // 임의 생성
    price: {
      min: 30000, // 임의 생성
      max: 50000,
    },
  },
  {
    id: "PF281717",
    title: "장애인과 함께하는 음악회: 아름다운 동행 [성남]",
    artist: "아름다운 동행 앙상블", // 임의 생성
    poster:
      "http://www.kopis.or.kr/upload/pfmPoster/PF_PF281717_251217_104137.jpg",
    period: "2025.12.21",
    venue: "성남아트센터",
    time: "오후 5시 00분", // 임의 생성
    price: {
      min: 0, // 무료 공연 추정
      max: 0,
    },
  },
  {
    id: "PF281644",
    title: "제7회 GTG 청소년오케스트라 정기연주회",
    artist: "GTG 청소년오케스트라", // 제목에서 유추
    poster:
      "http://www.kopis.or.kr/upload/pfmPoster/PF_PF281644_251216_105921.png",
    period: "2025.12.21",
    venue: "고양아람누리",
    time: "오후 4시 00분", // 임의 생성
    price: {
      min: 10000, // 청소년 연주회 통상 가격 추정
      max: 10000,
    },
  },
  {
    id: "PF281617",
    title: "임동혁의 크리스마스 음악선물 [화성]",
    artist: "임동혁", // 제목에서 유추
    poster:
      "http://www.kopis.or.kr/upload/pfmPoster/PF_PF281617_251215_150928.gif",
    period: "2025.12.21",
    venue: "남양성모성지",
    time: "오후 7시 30분", // 임의 생성
    price: {
      min: 50000, // 임의 생성
      max: 50000,
    },
  },
  {
    id: "PF281557",
    title: "오잉클! (12월)",
    artist: "오감 앙상블", // 임의 생성
    poster:
      "http://www.kopis.or.kr/upload/pfmPoster/PF_PF281557_251215_124338.jpg",
    period: "2025.12.21",
    venue: "오감클래식",
    time: "오전 11시 00분", // 마티네 공연 추정
    price: {
      min: 20000, // 소규모 공연장 통상 가격 추정
      max: 30000,
    },
    // rank는 선택적(optional) 속성이므로 일부러 제외한 케이스 예시
  },
];

interface ResultSummaryProps {
  count: number;
  isOpen: boolean;
  onClick: () => void;
}
const ResultHeader = ({ count, isOpen, onClick }: ResultSummaryProps) => {
  const buttonStyle =
    "flex justify-center items-center gap-[0.44rem] rounded-button w-[5.26rem] h-[1.75rem] text-[0.77rem]/[1.09rem]";

  return (
    <div className="fixed z-70 top-desktop-header-shrinked border-b border-black/10 w-screen">
      <div className="bg-white flex justify-between items-center max-w-7xl mx-auto h-[3.56rem] px-7">
        <span className="text-dark text-[0.88rem]/[1.31rem] font-semibold">
          {count}개의 클래식 공연
        </span>
        {isOpen ? (
          <button
            className={`${buttonStyle} bg-main text-white`}
            onClick={onClick}
          >
            <img src={closeIcon} alt="닫기 아이콘" />
            필터 닫기
          </button>
        ) : (
          <button
            className={`${buttonStyle} border border-black/10 bg-white text-dark`}
            onClick={onClick}
          >
            <img src={filterIcon} alt="필터 아이콘" />
            필터 보기
          </button>
        )}
      </div>
    </div>
  );
};

interface ResultMobileProps {
  isFilterOpen: boolean;
  onClickClose: () => void;
}

const ResultMobile = ({ isFilterOpen, onClickClose }: ResultMobileProps) => {
  return (
    <div className="block desktop:hidden">
      <ResultFilterMobile
        isOpen={isFilterOpen}
        onClose={onClickClose}
        totalResultCount={MOCKUP_DATA.length}
      />
      <div className="flex flex-col gap-[0.88rem] w-full">
        {MOCKUP_DATA.map((performance) => (
          <PerformanceListCard key={performance.title} data={performance} />
        ))}
      </div>
    </div>
  );
};

interface ResultDesktopProps {
  isOpen: boolean;
}

const ResultDesktop = ({ isOpen }: ResultDesktopProps) => {
  const isDesktop = useBreakpoint(1280);
  const isMobile = useBreakpoint(960);
  let galleryStyle;
  // 뷰포트 너비와 필터 열림 여부를 확인하여 그리드 열 개수 설정
  if (!isMobile && isDesktop) {
    galleryStyle = isOpen ? "grid-cols-2" : "grid-cols-3";
  } else {
    galleryStyle = "grid-cols-4";
  }

  return (
    <div className="hidden desktop:flex overflow-hidden h-result-content mt-result-header px-7">
      <div
        className={`flex-1 grid large-desktop:grid-cols-4 gap-[1.31rem] p-[0.88rem] overflow-y-auto ${galleryStyle}`}
      >
        {MOCKUP_DATA.map((item) => (
          <ResultAlbumItem data={item} />
        ))}
      </div>
      <ResultFilterDesktop isOpen={isOpen} />
    </div>
  );
};

// const ResultContext = createContext<DetailPerformance[] | null>(null);

const Result = () => {
  // 최상단 헤더의 열고닫음 상태를 관리
  const [isHeaderExpand, setIsHeaderExpand] = useState(false);
  // 오른쪽 필터의 열고닫음 상태를 관리
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  // 헤더 클릭 시 열고닫는 핸들러
  const headerToggle = (expand: boolean) => {
    setIsHeaderExpand(expand);
  };

  // 필터 버튼 클릭시 열고닫는 핸들러
  const toggleFilter = () => {
    setIsFilterOpen((prev) => !prev);
  };

  const closeFilter = () => {
    setIsFilterOpen(false);
  };

  // const [searchParams] = useSearchParams();
  // const keyword = searchParams.get("keyword");
  // const location = searchParams.get("location");
  // const minPrice = searchParams.get("min_price");
  // const maxPrice = searchParams.get("max_price");
  // const startDate = searchParams.get("start_date");
  // const endDate = searchParams.get("end_date");

  // const performances = getPerformance({
  //   keyword,
  //   location,
  //   minPrice,
  //   maxPrice,
  //   startDate,
  //   endDate,
  // });

  return (
    // <ResultContext.Provider value={performances}>
    <Modal>
      <Header isExpand={isHeaderExpand} onFilterClick={headerToggle} />
      <ResultHeader count={24} isOpen={isFilterOpen} onClick={toggleFilter} />
      {isHeaderExpand && (
        <div className="fixed top-0 left-0 z-15 bg-[rgba(0,0,0,0.3)] w-full h-full"></div>
      )}
      <main className="bg-white max-w-7xl mx-auto mt-desktop-header-shrinked">
        <div>
          <ResultMobile
            isFilterOpen={isFilterOpen}
            onClickClose={closeFilter}
          />
          <ResultDesktop isOpen={isFilterOpen} />
        </div>
      </main>
      <Footer />
    </Modal>
    // </ResultContext.Provider>
  );
};

export default Result;
