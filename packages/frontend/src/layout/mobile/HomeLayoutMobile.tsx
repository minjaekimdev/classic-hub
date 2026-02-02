import React from "react";
import useHomeLayoutMobile from "../hooks/useHomeLayoutMobile";
import BottomSheet from "@/shared/ui/bottom-sheet/BottomSheet";
import HomeHeaderMobile from "./HomeHeaderMobile";
import SearchFilterMobile from "@/features/search/ui/mobile/SearchFilterMobile";
import SearchMobile from "@/features/search/hooks/SearchMobile";

const HomeLayoutMobile = ({ children }: { children: React.ReactNode }) => {
  const { ref, marginTop } = useHomeLayoutMobile();
  return (
    <>
      <BottomSheet>
        <BottomSheet.Wrapper>
          {/* 모바일 검색 필터 내 값들 context로 관리 */}
          <SearchMobile>
            <SearchFilterMobile />
          </SearchMobile>
        </BottomSheet.Wrapper>
        <HomeHeaderMobile/>
        <div ref={ref} className="h-1 bg-transparent"></div>
        <main className={`pt-6 pb-[6.12rem] ${marginTop}`}>{children}</main>
      </BottomSheet>
    </>
  );
};

export default HomeLayoutMobile;
