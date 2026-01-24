import { type ReactNode } from "react";
import Header from "./Header";
import Footer from "@/shared/layout/Footer";
import HomeMobileHeader from "../mobile/HomeHeaderMobile";
import useHomeLayout from "../hooks/useHomeLayout";
import Modal from "@/shared/ui/modals/Modal";
import SearchFilterMobile from "@/features/filter/search/components/mobile/FilterMobile";

const HomeLayout = ({ children }: { children: ReactNode }) => {
  const {
    ref,
    isIntersecting,
    isFilterActive,
    isMobile,
    changeFilterState,
    isExpand,
    getMarginTop,
  } = useHomeLayout();

  return (
    <Modal>
      {isMobile && <SearchFilterMobile />}
      {/* 모바일 헤더는 스크롤이 내려갈 때에만 축소되므로 isIntersecting만으로 확대축소 여부 판단 */}
      <HomeMobileHeader isExpand={isIntersecting} />
      <Header isExpand={isExpand} onChangeFilterState={changeFilterState} />
      {isFilterActive && (
        <div className="fixed top-0 left-0 z-15 bg-[rgba(0,0,0,0.3)] w-full h-full"></div>
      )}
      <div ref={ref} className="h-1 bg-transparent"></div>
      <main className={`pt-6 pb-[6.12rem] ${getMarginTop()}`}>{children}</main>
      <Footer />
    </Modal>
  );
};

export default HomeLayout;
