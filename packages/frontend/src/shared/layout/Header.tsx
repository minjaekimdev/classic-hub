import FilterDesktop from "@/features/filter/components/FilterDesktop";
import Menu from "./HeaderMenu";
import { useEffect, useRef, useState, type SetStateAction } from "react";
import FilterSmall from "@/features/filter/components/FilterDesktopSmall";
import useClickOutside from "@/shared/hooks/useClickOutside";
import Logo from "@/shared/layout/Logo";
import HeaderAuthButton from "@/shared/layout/HeaderAuthButton";
import searchIcon from "@shared/assets/icons/search-gray.svg";
import logoIcon from "@shared/assets/logos/classichub.svg";
import type { filterCategoryObjType } from "@/shared/model/filter";
import FilterMobile from "@/features/filter/components/FilterMobile";

const MobileHeader = () => {
  const [filterActive, setFilterActive] = useState(false);

  // 필터가 활성화된 상태라면 뷰포트의 스크롤을 해제
  useEffect(() => {
    if (filterActive) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [filterActive]);

  return (
    <>
      {!filterActive ? (
        <div className="fixed z-20 bg-[linear-gradient(180deg,#FFF_39.9%,#F8F8F8_100%)] w-full">
          <div className="flex justify-center items-center p-6">
            <div className="flex flex-col items-center gap-6 w-full">
              <div className="flex justify-center gap-[0.28rem]">
                <img className="w-7 h-7" src={logoIcon} alt="" />
                <h1 className="mt-auto text-[#101828] text-[1.31rem]/[1.31rem] font-logo font-bold ">
                  ClassicHub
                </h1>
              </div>
              <div
                className="flex justify-center items-center rounded-full w-full h-[2.88rem] border border-gray-200 bg-white shadow-xl cursor-pointer"
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

interface DesktopHeaderProps {
  onChange: React.Dispatch<SetStateAction<boolean>>;
}

const DesktopHeader = ({ onChange }: DesktopHeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false); // window.scrollY > 0이면 isScrolled = true, 0이면 false
  const [isManuallyExpanded, setManuallyExpanded] = useState(false); // 축소된 필터를 클릭한 경우 true
  const [filterValue, setFilterValue] = useState<filterCategoryObjType>({
    searchText: "",
    location: "지역",
    price: "가격",
    date: "날짜",
  });
  const headerRef = useRef<HTMLDivElement | null>(null);

  // 헤더가 확장되는 경우는 스크롤 위치가 0이거나 축소된 필터를 클릭한 경우
  const headerExpand = !isScrolled || isManuallyExpanded;
  const headerMarginBottom = headerExpand ? "1.5rem" : "0";

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

  useEffect(() => {
    onChange(headerExpand);
  }, [headerExpand, onChange]);

  return (
    <div
      ref={headerRef}
      className="fixed top-0 z-20 w-full bg-[linear-gradient(180deg,#FFF_39.9%,#F8F8F8_100%)] transition-height duration-200 ease-in-out"
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

interface HeaderProps {
  onChange: React.Dispatch<SetStateAction<boolean>>;
}

const Header = ({ onChange }: HeaderProps) => {
  return (
    <div className="w-full border-b border-[#e5e7eb]">
      <div className="block max-[600px]:hidden">
        <DesktopHeader onChange={onChange} />
      </div>
      <div className="hidden max-[600px]:block">
        <MobileHeader />
      </div>
    </div>
  );
};

export default Header;
