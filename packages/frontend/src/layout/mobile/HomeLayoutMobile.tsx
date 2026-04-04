import React from "react";
import useHomeLayoutMobile from "../hooks/useHomeLayoutMobile";
import HomeHeaderMobile from "@/widgets/home/ui/HomeHeaderMobile";

const HomeLayoutMobile = ({ children }: { children: React.ReactNode }) => {
  const { ref, isScrollZero, marginTop } = useHomeLayoutMobile();
  return (
    <>
      <HomeHeaderMobile isScrollZero={isScrollZero} />
      <div ref={ref} className="h-1 bg-transparent"></div>
      <main className={`pt-6 ${marginTop}`}>{children}</main>
    </>
  );
};

export default HomeLayoutMobile;
