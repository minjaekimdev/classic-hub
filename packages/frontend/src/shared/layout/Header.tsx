import FilterDesktop from "@/features/filter/components/search/FilterDesktop";
import Menu from "./HeaderMenu";
import { useEffect, useState } from "react";
import FilterDesktopSmall from "@/features/filter/components/search/FilterDesktopSmall";
import Logo from "@/shared/layout/Logo";
import HeaderAuthButton from "@/shared/layout/HeaderAuthButton";
import searchIcon from "@shared/assets/icons/search-gray.svg";
import logoIcon from "@shared/assets/logos/classichub.svg";
import FilterMobile from "@/features/filter/components/search/FilterMobile";
import useHeader from "../hooks/useHeader";
import type { filterCategoryObjType } from "../../features/filter/model/filter";

const MobileHeader = () => {
  const [isFilterActive, setIsFilterActive] = useState(false);

  const filterToggle = (isOpen: boolean) => {
    setIsFilterActive(isOpen);
  };

  // 필터가 활성화된 상태라면 뷰포트의 스크롤을 해제
  useEffect(() => {
    if (isFilterActive) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isFilterActive]);

  return (
    <>
      {!isFilterActive ? (
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
                onClick={() => filterToggle(true)}
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
          <FilterMobile onClickClose={() => filterToggle(false)} />
        </div>
      )}
    </>
  );
};

interface DesktopHeaderProps {
  // 스크롤, 클릭 등으로 헤더의 상태를 바꾸는 경우 실행되는 콜백
  onExpandChange: (expand: boolean) => void;
}

const DesktopHeader = ({ onExpandChange }: DesktopHeaderProps) => {
  const {
    headerExpand,
    headerRef,
    headerMarginBottom,
    filterValue,
    setIsFilterClicked,
    setFilterValue,
  } = useHeader();

  // 필터 상태 부모(MainLayout)에 동기화
  useEffect(() => {
    onExpandChange(headerExpand);
  }, [headerExpand, onExpandChange]);

  // 축소된 필터(FilterDesktopSmall)에 클릭 시 확장을 위해 전달
  const filterOpen = () => {
    setIsFilterClicked(true);
  };

  const filterValueChange = (value: filterCategoryObjType) => {
    setFilterValue(value);
  };

  return (
    <div
      ref={headerRef}
      className="fixed top-0 z-20 w-full bg-[linear-gradient(180deg,#FFF_39.9%,#F8F8F8_100%)]"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col max-w-7xl m-[0_auto] px-7">
        <div
          className="flex justify-between items-start"
          style={{ marginBottom: headerMarginBottom }}
        >
          <Logo />
          {!headerExpand ? (
            <FilterDesktopSmall
              filterValue={filterValue}
              onFilterClick={filterOpen}
            />
          ) : (
            <Menu />
          )}
          <div className="mt-7">
            <HeaderAuthButton />
          </div>
        </div>
        {headerExpand && (
          <div className="flex justify-center pb-8">
            <FilterDesktop
              filterValue={filterValue}
              onChange={filterValueChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

interface HeaderProps {
  // 스크롤, 클릭 등으로 헤더의 상태를 바꾸는 경우 실행되는 콜백
  onExpandChange: (expand: boolean) => void;
}

const Header = ({ onExpandChange }: HeaderProps) => {
  return (
    <div className="w-full border-b border-[#e5e7eb]">
      <div className="block max-[600px]:hidden">
        <DesktopHeader onExpandChange={onExpandChange} />
      </div>
      <div className="hidden max-[600px]:block">
        <MobileHeader />
      </div>
    </div>
  );
};

export default Header;
