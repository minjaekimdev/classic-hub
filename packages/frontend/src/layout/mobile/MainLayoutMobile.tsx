import React from "react";
import BottomSheet from "@/shared/ui/bottom-sheet/BottomSheet";
import SearchFilterMobile from "@/features/search/ui/mobile/SearchFilterMobile";
import SearchMobile from "@/features/search/hooks/SearchMobile";
import MainHeaderMobile from "./MainHeaderMobile";

const MainLayoutMobile = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <BottomSheet>
        <BottomSheet.Wrapper>
          {/* 모바일 검색 필터 내 값들 context로 관리 */}
          <SearchMobile>
            <SearchFilterMobile />
          </SearchMobile>
        </BottomSheet.Wrapper>
        <MainHeaderMobile />
        <main>{children}</main>
      </BottomSheet>
    </>
  );
};

export default MainLayoutMobile;
