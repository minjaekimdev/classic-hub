import React from "react";
import MainHeaderMobile from "../../widgets/shared/ui/MainHeaderMobile";
import Footer from "@/widgets/shared/ui/Footer";
import BottomSheetProvider from "@/shared/ui/bottom-sheet/BottomSheet";
import SearchMobile from "@/features/filter/contexts/search-context.mobile";

const MainLayoutMobile = ({ children }: { children: React.ReactNode }) => {
  return (
    <SearchMobile>
      <BottomSheetProvider>
        <MainHeaderMobile />
        <main className="bg-[#f3f4f6] p-3 min-h-main-mobile">{children}</main>
        <Footer />
      </BottomSheetProvider>
    </SearchMobile>
  );
};

export default MainLayoutMobile;
