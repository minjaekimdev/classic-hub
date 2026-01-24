import MainLayout from "@/shared/layout/desktop/MainLayout";
import filterIcon from "@shared/assets/icons/filter-dark.svg";
import closeIcon from "@shared/assets/icons/close-white.svg";
import { useState } from "react";
import useResultFilter from "@/features/filter/result/hooks/useResultFilter";
import ResultFilterDesktop from "@/features/filter/components/result/ResultFilterDesktop";
import type { PerformanceSummary } from "@classic-hub/shared/types/client";
import ResultAlbumItem from "@/features/performance/components/ResultAlbumItem";
import useWindowSize from "@/shared/hooks/useWindowSize";
import ListItem from "@/features/performance/components/ListItem";
import ResultFilterMobile from "@/features/filter/components/result/ResultFilterMobile";
import useBodyScrollLock from "@/shared/hooks/useBodyScrollLock";

interface ResultSummaryProps {
  count: number;
  isOpen: boolean;
  onClick: () => void;
}
const ResultSummary = ({ count, isOpen, onClick }: ResultSummaryProps) => {
  const buttonStyle =
    "flex justify-center items-center gap-[0.44rem] rounded-button w-[5.26rem] h-[1.75rem] text-[0.77rem]/[1.09rem]";
  return (
    <div className="flex justify-between items-center h-[3.56rem] px-[0.88rem]">
      <span className="text-dark text-[0.88rem]/[1.31rem] font-semibold">
        {count}개의 클래식 공연
      </span>
      {isOpen ? (
        <button
          className={`${buttonStyle} bg-main text-white`}
          onClick={() => onClick()}
        >
          <img src={closeIcon} alt="닫기 아이콘" />
          필터 닫기
        </button>
      ) : (
        <button
          className={`${buttonStyle} bg-white text-dark`}
          onClick={() => onClick()}
        >
          <img src={filterIcon} alt="필터 아이콘" />
          필터 보기
        </button>
      )}
    </div>
  );
};

interface ResultMobileProps {
  filter: ReturnType<typeof useResultFilter>;
  isFilterOpen: boolean;
  onClickClose: () => void;
}

const ResultMobile = ({
  filter,
  isFilterOpen,
  onClickClose,
}: ResultMobileProps) => {
  return (
    <div className="">
      <ResultFilterMobile
        isOpen={isFilterOpen}
        onClose={onClickClose}
        filter={filter}
        totalResultCount={MOCKUP_DATA.length}
      />
      <div className="flex flex-col gap-[0.88rem] w-full">
        {MOCKUP_DATA.map((performance) => (
          <ListItem key={performance.title} data={performance} />
        ))}
      </div>
    </div>
  );
};

interface ResultDesktopProps {
  filter: ReturnType<typeof useResultFilter>;
  isOpen: boolean;
}
const ResultDesktop = ({ filter, isOpen }: ResultDesktopProps) => {
  const windowSize = useWindowSize();
  let galleryStyle;
  // 뷰포트 너비와 필터 열림 여부를 확인하여 그리드 열 개수 설정
  if (960 <= windowSize && windowSize < 1280) {
    galleryStyle = isOpen ? "grid-cols-2" : "grid-cols-3";
  } else {
    galleryStyle = "grid-cols-4";
  }

  return (
    <div className="flex overflow-hidden h-full">
      <div
        className={`flex-1 grid large-desktop:grid-cols-4 gap-[1.31rem] p-[0.88rem] overflow-y-auto ${galleryStyle}`}
      >
        {MOCKUP_DATA.map((item) => (
          <ResultAlbumItem data={item} />
        ))}
      </div>
      <ResultFilterDesktop isOpen={isOpen} filter={filter} />
    </div>
  );
};

// 헤더의 Search Filter로 1차 검색된 결과물
const MOCKUP_DATA: PerformanceSummary[] = [
  {
    id: "PF281871",
    title: "이민성 피아노 리사이틀: DRAMA",
    artist: "이민성", // 제목에서 유추
    posterUrl:
      "http://www.kopis.or.kr/upload/pfmPoster/PF_PF281871_251219_111529.gif",
    date: {
      start: "2025.12.21",
      end: "2025.12.21",
    },
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
    posterUrl:
      "http://www.kopis.or.kr/upload/pfmPoster/PF_PF281717_251217_104137.jpg",
    date: {
      start: "2025.12.21",
      end: "2025.12.21",
    },
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
    posterUrl:
      "http://www.kopis.or.kr/upload/pfmPoster/PF_PF281644_251216_105921.png",
    date: {
      start: "2025.12.21",
      end: "2025.12.21",
    },
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
    posterUrl:
      "http://www.kopis.or.kr/upload/pfmPoster/PF_PF281617_251215_150928.gif",
    date: {
      start: "2025.12.21",
      end: "2025.12.21",
    },
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
    posterUrl:
      "http://www.kopis.or.kr/upload/pfmPoster/PF_PF281557_251215_124338.jpg",
    date: {
      start: "2025.12.21",
      end: "2025.12.21",
    },
    venue: "오감클래식",
    time: "오전 11시 00분", // 마티네 공연 추정
    price: {
      min: 20000, // 소규모 공연장 통상 가격 추정
      max: 30000,
    },
    // rank는 선택적(optional) 속성이므로 일부러 제외한 케이스 예시
  },
];

const Result = () => {
  useBodyScrollLock();
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [isFilterOpen2, setIsFilterOpen2] = useState(true);
  const filter = useResultFilter();

  const closeFilter = () => {
    setIsFilterOpen(false);
  };

  const toggleDesktopFilter = () => {
    setIsFilterOpen2((prev) => !prev);
  };

  return (
    <MainLayout>
      <div className="flex-col h-100">
        <ResultSummary
          count={24}
          isOpen={isFilterOpen2}
          onClick={toggleDesktopFilter}
        />
        <div className="block desktop:hidden">
          <ResultMobile
            filter={filter}
            isFilterOpen={isFilterOpen}
            onClickClose={closeFilter}
          />
        </div>
        <div className="hidden desktop:block h-full">
          <ResultDesktop filter={filter} isOpen={isFilterOpen2} />
        </div>
      </div>
    </MainLayout>
  );
};

export default Result;
