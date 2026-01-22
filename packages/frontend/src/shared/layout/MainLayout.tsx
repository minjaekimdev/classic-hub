import { useState } from 'react';
import Header from '@shared/layout/Header';
import Footer from '@shared/layout/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [isHeaderExpand, setIsHeaderExpand] = useState(false);

  const headerToggle = (expand: boolean) => {
    setIsHeaderExpand(expand)
  }

  const desktopMarginClass = isHeaderExpand
    ? "min-[600px]:mt-[13.12rem]"
    : "min-[600px]:mt-[5rem]";

  return (
    <>
      <Header isExpand={isHeaderExpand} onChangeFilterState={headerToggle} />
      <main
        className={`pt-6 tablet:pt-8 mt-[9.12rem] ${desktopMarginClass} pb-[6.12rem] px-7 bg-white max-w-7xl mx-auto`}
      >
        {children}
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;