import FilterDesktop from "@/features/filter/FilterDesktop";
import Menu from "../shared/ui/HeaderMenu";
import { useEffect, useRef, useState } from "react";
import FilterSmall from "../features/filter/FilterDesktopSmall";
import useClickOutside from "@/shared/hooks/useClickOutside";
import Logo from "@/shared/ui/Logo";
import HeaderAuthButton from "@/shared/ui/HeaderAuthButton";
import searchIcon from "@shared/assets/icons/search-gray.svg";
import logoIcon from "@shared/assets/logos/classichub.svg";
import type { filterCategoryObjType } from "@/shared/model/filter";
import FilterMobile from "@/features/filter/FilterMobile";

const MobileHeader = () => {
  const [filterActive, setFilterActive] = useState(false);

  useEffect(() => {
    if (filterActive) {
      // 모달이 열리면: body의 스크롤을 막음
      document.body.style.overflow = "hidden";
    } else {
      // 모달이 닫히면: body의 스크롤을 다시 허용
      document.body.style.overflow = "auto";
    }

    // 컴포넌트가 언마운트될 때(페이지 이동 등) 안전하게 스크롤을 풀어줌
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [filterActive]);
  return (
    <>
      {!filterActive ? (
        <div className="fixed z-20 bg-[#ebebeb] w-full">
          <div className="flex justify-center items-center px-6 h-[11.7rem]">
            <div className="flex flex-col items-center gap-6 w-full">
              <div className="flex justify-center gap-[0.28rem]">
                <img className="w-7 h-7" src={logoIcon} alt="" />
                <h1 className="mt-auto text-[#101828] text-[1.31rem]/[1.31rem] font-logo font-bold ">
                  ClassicHub
                </h1>
              </div>
              <div
                className="flex justify-center items-center rounded-full w-full h-[2.88rem] border-2 border-solid border-[#e5e7eb] bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] cursor-pointer"
                onClick={() => setFilterActive(true)}
              >
                <div className="flex shrink-0 gap-[0.6rem]">
                  <img src={searchIcon} alt="" />
                  <span className="text-[#6a7282] text-[0.88rem]/[1.31rem]">
                    원하는 클래식 공연을 검색해보세요
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="fixed top-0 left-0 z-80 w-full h-full bg-[rgba(0,0,0,0.5)]">
          <FilterMobile onClose={setFilterActive} />
        </div>
      )}
    </>
  );
};

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
      className="fixed z-20 w-full bg-[linear-gradient(180deg,#FFF_39.9%,#F8F8F8_100%)] transition-height duration-200 ease-in-out"
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
          <HeaderAuthButton />
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

const Header = () => {
  return (
    <div className="w-full border-b border-[#e5e7eb]">
      <div className="block max-[600px]:hidden">
        <DesktopHeader />
      </div>
      <div className="hidden max-[600px]:block">
        <MobileHeader />
      </div>
    </div>
  );
};

export default Header;
