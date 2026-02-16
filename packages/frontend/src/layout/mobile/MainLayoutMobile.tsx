import React from "react";
import BottomSheet from "@/shared/ui/bottom-sheet/BottomSheet";
import MainHeaderMobile from "../../widgets/shared/ui/MainHeaderMobile";
import SearchMobile from "@/features/filter/contexts/search-mobile-context";
import SearchFilterMobile from "@/features/filter/ui/mobile/SearchFilterMobile";
import Footer from "@/widgets/shared/ui/Footer";

interface MainLayoutMobileProps {
  children: React.ReactNode;
  bottomSheetContent: React.ReactNode;
}

const MainLayoutMobile = ({
  children,
  bottomSheetContent,
}: MainLayoutMobileProps) => {
  return (
    <>
      <BottomSheet>
        <BottomSheet.Wrapper>
          {/* 모바일 검색 필터 내 값들 context로 관리 */}
          <SearchMobile>
            <SearchFilterMobile />
          </SearchMobile>
          {bottomSheetContent}
        </BottomSheet.Wrapper>
        <MainHeaderMobile />
        <main className="bg-[#f3f4f6] p-3 min-h-main-mobile">{children}</main>
        <Footer />
      </BottomSheet>
    </>
  );
};

export default MainLayoutMobile;
