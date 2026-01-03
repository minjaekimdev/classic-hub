import Logo from "@/shared/ui/logos/Logo";
import DesktopSearchFilter from "@features/filter/components/search/desktop/DesktopSearchFilter";
import { useRef } from "react";
import FilterDesktopSmall from "@features/filter/components/search/desktop/FilterDesktopSmall";
import { SearchFilter } from "@/features/filter/components/search/shared/SearchFilter";
import type { FilterHandle } from "@/features/filter/components/search/shared/SearchFilter";
import useClickOutside from "@/shared/hooks/useClickOutside";
import { useState } from "react";

interface MenuItemProps {
  icon: string;
  text: string;
  selected: string;
  onSelect: (text: string) => void;
}

const MenuItem = ({ icon, text, selected, onSelect }: MenuItemProps) => {
  const isSelected = selected === text;

  const textColorClass = isSelected
    ? "text-main font-medium"
    : "text-[#6a6a6a] mb-2";

  return (
    <div
      className={"flex flex-col gap-[0.69rem] cursor-pointer"}
      onClick={() => onSelect(text)}
    >
      <div
        className={`flex items-center gap-3 ${textColorClass}`}
        onClick={() => onSelect(text)}
      >
        <span className="text-[2.13rem]/[2.13rem]">{icon}</span>
        <span className="shrink-0 text-[0.88rem]/[1.13rem] font-medium">
          {text}
        </span>
      </div>
      {isSelected && (
        <div className="border-b-3 border-black rounded-full"></div>
      )}
    </div>
  );
};

const menuItemArray = [
  {
    icon: "🎻",
    text: "홈",
  },
  {
    icon: "🏆",
    text: "공연 랭킹",
  },
];

const Menu = () => {
  const [selected, setSelected] = useState("홈");
  return (
    <div className="shrink-0 flex gap-[1.56rem]">
      {menuItemArray.map((item) => (
        <MenuItem
          key={item.text}
          icon={item.icon}
          text={item.text}
          selected={selected}
          onSelect={setSelected}
        />
      ))}
    </div>
  );
};

const HeaderAuthButton = () => {
  return (
    <div className="flex gap-[0.44rem]">
      <button className="shrink-0 flex justify-center items-center rounded-button p-[0.31rem_0.59rem] text-dark text-[0.77rem]/[1.09rem] font-medium">
        로그인
      </button>
      <button className="shrink-0 flex justify-center items-center rounded-button p-[0.31rem_0.54rem] bg-main text-white text-[0.77rem]/[1.09rem]">
        회원가입
      </button>
    </div>
  );
};

// 헤더는 확장되어야 하는지 아닌지 여부만 props로 전달받기
interface HeaderProps {
  isExpand: boolean;
  changeFilterState: (isFilterActive: boolean) => void;
}
const Header = ({ isExpand, changeFilterState }: HeaderProps) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<FilterHandle>(null);

  // 헤더의 외부를 클릭하면 축소
  useClickOutside(headerRef, () => changeFilterState(false));
  // 애니메이션 설정

  // 헤더가 확장되어야 하는 경우와 그렇지 않은 경우의 높이를 달리하기
  const height = isExpand ? "h-54" : "h-21";

  return (
    <div
      ref={headerRef}
      className={`fixed top-0 z-20 bg-[linear-gradient(180deg,#FFF_39.9%,#F8F8F8_100%)] w-full ${height}`}
    >
      <div className="absolute left-7 top-0">
        <Logo />
      </div>
      <div className="absolute top-7 right-7">
        <HeaderAuthButton />
      </div>
      <div className="flex flex-col px-7 w-full max-w-[1920px]">
        <SearchFilter ref={filterRef}>
          {isExpand ? (
            <div className="flex justify-center mt-[1.87rem] mb-6">
              <Menu />
            </div>
          ) : (
            <div className="flex justify-center mt-4">
              <FilterDesktopSmall onFilterFieldClick={changeFilterState} />
            </div>
          )}

          {isExpand && (
            <div className="flex justify-center mb-8">
              <DesktopSearchFilter />
            </div>
          )}
        </SearchFilter>
      </div>
    </div>
  );
};

export default Header;
