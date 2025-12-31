import React, { useRef, useState } from 'react';
import Logo from '../Logo';
import FilterDesktopSmall from '@/features/filter/components/search/FilterDesktopSmall';
import { Menu } from 'lucide-react';
import HeaderAuthButton from '../HeaderAuthButton';
import FilterDesktop from '@/features/filter/components/search/FilterDesktop';

const DesktopHeader = () => {
  const [isExpand, setIsExpand] = useState(false);
  const filterRef = useRef(null);

  // Header가 축소될 때 실행될 로직
  const handleFilterShrink = () => {

  }

  // Header가 확장될 때 실행될 로직
  const handleFilterExpand = () => {
    
  }

  return (
    <div
      className="fixed top-0 z-20 w-full bg-[linear-gradient(180deg,#FFF_39.9%,#F8F8F8_100%)]"
      // 헤더 영역에서의 클릭은 전파를 막아 헤더가 닫히지 않도록
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col max-w-7xl m-[0_auto] px-7">
        <div
          className="flex justify-between items-start mb-6"
        >
          <Logo />
          <div className="flex flex-col gap-6 mt-[1.87rem] mb-8">
            <Menu></Menu>
            <FilterDesktop />
          </div>
          <div className="mt-7">
            <HeaderAuthButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopHeader;