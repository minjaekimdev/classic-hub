import { createContext, useContext } from "react";
import Modal from "@/shared/ui/modal/Modal";
import useBreakpoint from "@/shared/hooks/useBreakpoint";
import type { PerformanceSummary } from "@classic-hub/shared/types/client";
import { Toaster } from "sonner";
import BookingModal from "@/features/booking/BookingModal";
import { BREAKPOINTS } from "@/shared/constants";
import MainLayoutMobile from "@/layout/mobile/MainLayoutMobile";
import LayoutDesktop from "@/layout/desktop/LayoutDesktop";
import FeedbackModal from "@/features/feedback/FeedbackModal";
import PerformanceSection from "@/widgets/result/PerformanceSection";
import FilterDesktop from "@/features/filter/ui/desktop/FilterDesktop";
import FilterMobile from "@/features/filter/ui/mobile/FilterMobile";

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
    price: {
      min: 20000, // 소규모 공연장 통상 가격 추정
      max: 30000,
    },
    // rank는 선택적(optional) 속성이므로 일부러 제외한 케이스 예시
  },
];

const ResultContext = createContext<PerformanceSummary[] | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useResult = () => {
  const context = useContext(ResultContext);
  if (!context) {
    throw new Error("useResult should be used within a ModalProvider.");
  }
  return context;
};

const LayoutSwitcher = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useBreakpoint(BREAKPOINTS.TABLET);

  if (!isMobile) {
    return (
      <LayoutDesktop variant="main">
        <LayoutDesktop.Wrapper>{children}</LayoutDesktop.Wrapper>
      </LayoutDesktop>
    );
  } else {
    return (
      <MainLayoutMobile bottomSheetContent={<FilterMobile />}>
        {children}
      </MainLayoutMobile>
    );
  }
};

const Result = () => {
  return (
    <ResultContext.Provider value={MOCKUP_DATA}>
      <Toaster />
      <Modal>
        <BookingModal />
        <FeedbackModal />
        <Toaster />
        <LayoutSwitcher>
          <PerformanceSection />
          <FilterDesktop />
        </LayoutSwitcher>
      </Modal>
    </ResultContext.Provider>
  );
};

export default Result;
