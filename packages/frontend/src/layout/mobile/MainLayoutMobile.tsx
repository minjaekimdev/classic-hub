import React from "react";
import MainHeaderMobile from "../../widgets/shared/ui/MainHeaderMobile";

const MainLayoutMobile = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <MainHeaderMobile />
      <main className="min-h-main-mobile bg-[#f3f4f6] p-3">{children}</main>
    </>
  );
};

export default MainLayoutMobile;
