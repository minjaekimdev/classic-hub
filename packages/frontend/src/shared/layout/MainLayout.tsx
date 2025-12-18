import { useState } from 'react';
import Header from '@shared/layout/Header';
import Footer from '@shared/layout/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [headerExpand, setHeaderExpand] = useState(false);

  const desktopMarginClass = headerExpand
    ? "min-[600px]:mt-[13.12rem]"
    : "min-[600px]:mt-[5rem]";

  return (
    <>
      <Header onChange={setHeaderExpand} />
      <main
        className={`pt-6 min-[600px]:pt-8 mt-[9.12rem] ${desktopMarginClass} pb-[6.12rem] px-7 bg-white max-w-7xl mx-auto`}
      >
        {children}
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;