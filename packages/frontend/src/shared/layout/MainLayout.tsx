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

  return (
    <>
      <Header isExpand={isHeaderExpand} onChangeFilterState={headerToggle} />
      {isHeaderExpand && (
        <div className="fixed top-0 left-0 z-15 bg-[rgba(0,0,0,0.3)] w-full h-full"></div>
      )}
      <main
        className={`pt-6 tablet:pt-8 mt-20 pb-[6.12rem] px-7 bg-white max-w-7xl mx-auto`}
      >
        {children}
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;