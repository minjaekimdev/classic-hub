import React from "react";
import useHomeLayoutMobile from "../hooks/useHomeLayoutMobile";
import BottomSheet from "@/shared/ui/bottom-sheet/BottomSheet";
import HomeHeaderMobile from "@/widgets/home/ui/HomeHeaderMobile";
import Footer from "@/widgets/shared/ui/Footer";

const HomeLayoutMobile = ({ children }: { children: React.ReactNode }) => {
  const { ref, isScrollZero, marginTop } = useHomeLayoutMobile();
  return (
    <>
      <BottomSheet>
        <HomeHeaderMobile isScrollZero={isScrollZero} />
        <div ref={ref} className="h-1 bg-transparent"></div>
        <main className={`pt-6 pb-[6.12rem] ${marginTop}`}>{children}</main>
        <Footer />
      </BottomSheet>
    </>
  );
};

export default HomeLayoutMobile;
