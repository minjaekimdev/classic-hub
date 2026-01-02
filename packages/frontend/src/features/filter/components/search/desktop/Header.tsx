import Logo from "@/shared/layout/Logo";
import Menu from "./Menu";
import DesktopSearchFilter from "./DesktopSearchFilter";
import HeaderAuthButton from "@/shared/layout/HeaderAuthButton";
import { useRef } from "react";
import FilterDesktopSmall from "./FilterDesktopSmall";
import { SearchFilter } from "./SearchFilter";
import type { FilterHandle } from "./SearchFilter";
import useClickOutside from "@/shared/hooks/useClickOutside";

// 헤더는 확장되어야 하는지 아닌지 여부만 props로 전달받기
interface HeaderProps {
  isExpand: boolean;
  changeFilterState: (isFilterActive: boolean) => void;
}
const Header = ({ isExpand, changeFilterState }: HeaderProps) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<FilterHandle>(null);

  useClickOutside(headerRef, () => changeFilterState(false));

  return (
    <div
      ref={headerRef}
      className="fixed top-0 z-20 bg-[linear-gradient(180deg,#FFF_39.9%,#F8F8F8_100%)] w-full"
    >
      <div className="relative flex justify-center mx-auto px-7 max-w-[1920px]">
        <div className="absolute left-7 top-0">
          <Logo />
        </div>
        <div className="flex flex-col items-center w-[1000px]">
          {isExpand && (
            <div className="mt-[1.87rem]">
              <Menu />
            </div>
          )}
          <SearchFilter ref={filterRef}>
            {isExpand ? (
              <div className="mt-6 mb-8 w-full">
                <DesktopSearchFilter />
              </div>
            ) : (
              <FilterDesktopSmall onFilterFieldClick={changeFilterState} />
            )}
          </SearchFilter>
        </div>
        <div className="absolute top-7 right-7">
          <HeaderAuthButton />
        </div>
      </div>
    </div>
  );
};

export default Header;
