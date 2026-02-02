import Modal from "@/shared/ui/modal/Modal";
import React, { useState } from "react";
import useHeader from "../hooks/useHeader";
import HeaderDesktop from "../desktop/HeaderDesktop";
import ResultHeader from "@/widgets/result/ResultHeader";

const Layout = () => {
  const {isExpand, open, close} = useHeader();
  return (
    <Modal>
      <HeaderDesktop isExpand={isExpand} onFilterClick={headerToggle} />
      <ResultHeader count={24} isOpen={isFilterOpen} onClick={toggleFilter} />
      {isHeaderExpand && (
        <div className="fixed top-0 left-0 z-15 bg-[rgba(0,0,0,0.3)] w-full h-full"></div>
      )}
      <main className="bg-white max-w-7xl mx-auto mt-desktop-header-shrinked">
        <div>
          <ResultMobile
            isFilterOpen={isFilterOpen}
            onClickClose={closeFilter}
          />
          <ResultDesktop isOpen={isFilterOpen} />
        </div>
      </main>
      <Footer />
    </Modal>
  );
};

export default Layout;
