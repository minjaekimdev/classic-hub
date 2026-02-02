import { type ReactNode } from "react";
import Footer from "@/layout/shared/Footer";
import HomeHeaderMobile from "../mobile/HomeHeaderMobile";
import Modal from "@/shared/ui/modal/Modal";
import HeaderDesktop from "../desktop/HeaderDesktop";
import SearchFilterMobile from "@/features/search/ui/mobile/SearchFilterMobile";
import FeedbackModal from "@/features/feedback/FeedbackModal";
import BottomSheet from "@/shared/ui/bottom-sheet/BottomSheet";

const HomeLayout = ({ children }: { children: ReactNode }) => {
  const {
    ref,
    isIntersecting,
    isFilterActive,
    isMobile,
    onFilterClick,
    isExpand,
    getMarginTop,
  } = useHomeLayout();

  return (
    <Modal>
      <FeedbackModal />
      {isMobile ? (
        <BottomSheet>
          <SearchFilterMobile />
          {/* 모바일 헤더는 스크롤이 내려갈 때에만 축소되므로 isIntersecting만으로 확대축소 여부 판단 */}
          <HomeHeaderMobile isExpand={isIntersecting} />
        </BottomSheet>
      ) : (
        <>
          <HeaderDesktop isExpand={isExpand} onFilterClick={onFilterClick} />
          {/* 데스크톱 모드의 필터가 열렸다면 overlay 보여주기 */}
          {isFilterActive && (
            <div className="fixed top-0 left-0 z-15 bg-[rgba(0,0,0,0.3)] w-full h-full"></div>
          )}
        </>
      )}
      <div ref={ref} className="h-1 bg-transparent"></div>
      <main className={`pt-6 pb-[6.12rem] ${getMarginTop()}`}>{children}</main>
      <Footer />
    </Modal>
  );
};

export default HomeLayout;
