import FilterDesktop from "@/widgets/header/FilterDesktop";
import logoIcon from "@shared/assets/logos/classichub.svg";
import Menu from "./Menu";
import { useEffect, useRef, useState } from "react";
import FilterSmall from "./FilterSmall";
import useClickOutside from "@/shared/hooks/useClickOutside";

const Logo = () => {
  return (
    <div className="inline-block flex p-[1.62rem_0]">
      <div className="flex gap-[0.44rem]">
        <img className="w-7 h-7" src={logoIcon} alt="" />
        <h1 className="mt-auto text-[1.31rem]/[1.31rem] font-logo font-bold">
          ClassicHub
        </h1>
      </div>
    </div>
  );
};

const Auth = () => {
  return (
    <div className="flex gap-[0.44rem] mt-7">
      <button className="shrink-0 flex justify-center items-center rounded-[0.42rem] p-[0.31rem_0.59rem] text-[#0a0a0a] text-[0.77rem]/[1.09rem] font-medium">
        로그인
      </button>
      <button className="shrink-0 flex justify-center items-center rounded-[0.42rem] p-[0.31rem_0.54rem] bg-main text-white text-[0.77rem]/[1.09rem]">
        회원가입
      </button>
    </div>
  );
};

export interface filterCategoryObjType {
  searchText: string;
  location: string;
  price: string;
  date: string;
}

const DesktopHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false); // window.scrollY > 0이면 isScrolled = true, 0이면 false
  const [isManuallyExpanded, setManuallyExpanded] = useState(false); // 축소된 필터를 클릭한 경우 true
  const [filterValue, setFilterValue] = useState<filterCategoryObjType>({
    searchText: "",
    location: "지역",
    price: "가격",
    date: "날짜",
  });
  const headerRef = useRef<HTMLDivElement | null>(null);

  // 스크롤 발생 시 헤더 상태 최신화
  useEffect(() => {
    const scrollHandler = () => {
      if (window.scrollY === 0) {
        setIsScrolled(false);
      } else {
        setIsScrolled(true);
      }
      setManuallyExpanded(false);
    };
    window.addEventListener("scroll", scrollHandler);
    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, [setIsScrolled]);

  // 헤더의 외부를 클릭했을 때 닫기
  useClickOutside(headerRef as React.RefObject<HTMLElement>, () =>
    setManuallyExpanded(false)
  );

  // 헤더가 확장되는 경우는 스크롤 위치가 0이거나 축소된 필터를 클릭한 경우
  const headerExpand = !isScrolled || isManuallyExpanded; 
  const headerMarginBottom = headerExpand ? "1.5rem" : "0";

  return (
    <div
      ref={headerRef}
      className="fixed z-20 w-full bg-[linear-gradient(180deg,#FFF_39.9%,#F8F8F8_100%)]"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col max-w-7xl m-[0_auto] px-7">
        <div
          className="flex justify-between items-start"
          style={{ marginBottom: headerMarginBottom }}
        >
          <Logo />
          {!headerExpand ? (
            <FilterSmall
              filterValue={filterValue}
              onSelect={setManuallyExpanded}
            />
          ) : (
            <Menu />
          )}
          <Auth />
        </div>
        {headerExpand && (
          <div className="flex justify-center pb-8">
            <FilterDesktop
              filterValue={filterValue}
              setFilterValue={setFilterValue}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DesktopHeader;
