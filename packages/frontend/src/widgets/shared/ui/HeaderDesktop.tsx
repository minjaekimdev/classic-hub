import Logo from "@/shared/ui/logos/Logo";
import { useRef } from "react";
import useClickOutside from "@/shared/hooks/useClickOutside";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLayoutDesktop } from "@/layout/desktop/LayoutDesktop";
import SearchDesktop from "@/features/filter/contexts/SearchFilterDesktop";
import SearchFilterDesktop from "@/features/filter/ui/desktop/SearchFilterDesktop";
import SearchFilterSmall from "@/features/filter/ui/desktop/SearchFilterSmall";

interface MenuItemProps {
  icon: string;
  text: string;
  selected: string | undefined;
  onSelect: (text: string) => void;
}

const MAP_LINK: Record<string, string> = {
  홈: "/",
  "공연 랭킹": "/ranking",
};

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
      <div className={`flex items-center gap-3 ${textColorClass}`}>
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
  // 메뉴 클릭 시 이동을 위해 useNavigate 사용
  const navigate = useNavigate();

  // useState를 사용 시 페이지 이동에 따라 Header가 언마운트되어 상태가 초기화되므로 useLocation 사용
  // location.pathname(ranking 등 경로명)을 가져와 MenuItem의 selected로 활용
  const location = useLocation();

  const handleSelected = (text: string) => {
    const targetPath = `${MAP_LINK[text]}`;
    if (location.pathname === targetPath) {
      return;
    }
    navigate(`${MAP_LINK[text]}`);
  };

  const selected = menuItemArray.find(
    (item) => MAP_LINK[item.text] === location.pathname,
  )?.text;

  return (
    <div className="shrink-0 flex gap-[1.56rem]">
      {menuItemArray.map((item) => (
        <MenuItem
          key={item.text}
          icon={item.icon}
          text={item.text}
          selected={selected}
          onSelect={handleSelected}
        />
      ))}
    </div>
  );
};

const HeaderAuthButton = () => {
  return (
    <div className="flex gap-[0.44rem] h-8">
      <button className="shrink-0 flex justify-center items-center rounded-button p-[0.31rem_0.59rem] text-dark text-[0.77rem]/[1.09rem] font-medium">
        로그인
      </button>
      <button className="shrink-0 flex justify-center items-center rounded-button p-[0.31rem_0.54rem] bg-main text-white text-[0.77rem]/[1.09rem]">
        회원가입
      </button>
    </div>
  );
};

const HeaderDesktop = () => {
  const { isExpand, expand, shrink } = useLayoutDesktop();
  const headerRef = useRef<HTMLDivElement>(null);

  // 헤더의 외부를 클릭하면 축소
  useClickOutside(headerRef, shrink);
  // 애니메이션 설정

  // 헤더가 확장되어야 하는 경우와 그렇지 않은 경우의 높이를 달리하기
  const height = isExpand ? "h-54" : "h-21";

  return (
    <div
      ref={headerRef}
      className={`fixed top-0 z-(--z-header) bg-[linear-gradient(180deg,#FFF_39.9%,#F8F8F8_100%)] w-full ${height}`}
    >
      <div className="fixed inset-x-0 mx-auto flex flex-col px-7 w-full max-w-7xl">
        <div className="absolute left-7 top-0">
          <Link to="/">
            <div className="self-start flex p-[1.62rem_0]">
              <Logo />
            </div>
          </Link>
        </div>
        <SearchDesktop>
          {isExpand ? (
            <>
              <div className="flex justify-center mt-[1.87rem] mb-6">
                <Menu />
              </div>
              <div className="flex justify-center mb-8">
                <SearchFilterDesktop />
              </div>
            </>
          ) : (
            <div className="flex justify-center mt-4">
              <SearchFilterSmall onFilterClick={expand} />
            </div>
          )}
        </SearchDesktop>
        <div className="absolute top-7 right-7">
          <HeaderAuthButton />
        </div>
      </div>
    </div>
  );
};

export default HeaderDesktop;
