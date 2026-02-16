import React from "react";
import MainHeaderMobile from "../../widgets/shared/ui/MainHeaderMobile";
import Footer from "@/widgets/shared/ui/Footer";
import BottomSheetProvider from "@/shared/ui/bottom-sheet/BottomSheet";

const MainLayoutMobile = ({ children }: { children: React.ReactNode }) => {
  return (
    <BottomSheetProvider>
      <MainHeaderMobile />
      <main className="bg-[#f3f4f6] p-3 min-h-main-mobile">{children}</main>
      <Footer />
    </BottomSheetProvider>
  );
};

export default MainLayoutMobile;
