import Logo from "@/shared/ui/logos/Logo";
import { useRef } from "react";
import useClickOutside from "@/shared/hooks/useClickOutside";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLayoutDesktop } from "@/layout/desktop/LayoutDesktop";
import SearchDesktop from "@/features/filter/contexts/search-context.desktop";
import SearchFilterDesktop from "@/features/filter/ui/desktop/SearchFilterDesktop";
import SearchFilterSmall from "@/features/filter/ui/desktop/SearchFilterSmall";
import contactIcon from "@shared/assets/icons/telephone-dark.svg";
import feedbackIcon from "@shared/assets/icons/feedback.svg";
import { useModal } from "@/app/providers/modal/useModal";
import { ModalWrapper } from "@/app/providers/modal/ModalWrapper";

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
      className={"flex cursor-pointer flex-col gap-[0.69rem]"}
      onClick={() => onSelect(text)}
    >
      <div className={`flex items-center gap-3 ${textColorClass}`}>
        <span className="text-[2.13rem]/[2.13rem]">{icon}</span>
        <span className="shrink-0 text-[0.88rem]/[1.13rem] font-medium">
          {text}
        </span>
      </div>
      {isSelected && (
        <div className="rounded-full border-b-3 border-black"></div>
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
    <div className="flex shrink-0 gap-[1.56rem]">
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

// const HeaderAuthButton = () => {
//   return (
//     <div className="flex h-8 gap-[0.44rem]">
//       <button className="rounded-button text-dark flex shrink-0 items-center justify-center p-[0.31rem_0.59rem] text-[0.77rem]/[1.09rem] font-medium">
//         로그인
//       </button>
//       <button className="rounded-button bg-main flex shrink-0 items-center justify-center p-[0.31rem_0.54rem] text-[0.77rem]/[1.09rem] text-white">
//         회원가입
//       </button>
//     </div>
//   );
// };

const DEVELOPER_INFOS = [
  {
    label: "이메일",
    content: "minjaekimm1@gmail.com",
  },
  {
    label: "전화번호",
    content: "010-3048-8058",
  },
  {
    label: "블로그",
    content: "https://velog.io/@minjaekimm/posts",
  },
];

interface InfoLayoutProps {
  label: string;
  content: string;
}

const InfoLayout = ({ label, content }: InfoLayoutProps) => {
  return (
    <div className="flex flex-col gap-[0.34rem]">
      <dt className="text-[0.77rem]/[1.09rem] text-[#717182]">{label}</dt>
      <dd className="text-main text-[0.77rem]/[1.09rem]">{content}</dd>
    </div>
  );
};

export const ContactModal = () => {
  return (
    <ModalWrapper>
      <div className="rounded-main flex flex-col gap-4 bg-white p-[1.56rem]">
        {DEVELOPER_INFOS.map((item) => (
          <InfoLayout label={item.label} content={item.content} />
        ))}
      </div>
    </ModalWrapper>
  );
};

interface HeaderButtonLayoutProps {
  onClick: (...args: any[]) => void;
  children: React.ReactNode;
}
const HeaderButtonLayout = ({ onClick, children }: HeaderButtonLayoutProps) => {
  return (
    <div
      className="rounded-button text-dark gap-044 flex shrink-0 cursor-pointer items-center justify-center p-[0.31rem_0.59rem] text-[0.77rem]/[1.09rem] font-medium hover:bg-slate-100/70"
      onClick={onClick}
    >
      {children}
    </div>
  );
};

const ContactButton = () => {
  const { openModal } = useModal();

  return (
    <HeaderButtonLayout onClick={() => openModal("CONTACT", {})}>
      <img src={contactIcon} alt="" className="h-4 w-4" />
      Developer
    </HeaderButtonLayout>
  );
};

const FeedbackButton = () => {
  const { openModal } = useModal();
  return (
    <HeaderButtonLayout onClick={() => openModal("FEEDBACK", {})}>
      <img src={feedbackIcon} alt="" className="h-4 w-4" />
      Feedback
    </HeaderButtonLayout>
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
      className={`fixed top-0 z-(--z-header) w-full bg-[linear-gradient(180deg,#FFF_39.9%,#F8F8F8_100%)] ${height}`}
    >
      <div className="fixed inset-x-0 mx-auto flex w-full max-w-7xl flex-col px-7">
        <div className="absolute top-0 left-7">
          <Link to="/">
            <div className="flex self-start p-[1.62rem_0]">
              <Logo />
            </div>
          </Link>
        </div>
        <SearchDesktop>
          {isExpand ? (
            <>
              <div className="mt-[1.87rem] mb-6 flex justify-center">
                <Menu />
              </div>
              <div className="mb-8 flex justify-center">
                <SearchFilterDesktop />
              </div>
            </>
          ) : (
            <div className="mt-4 flex justify-center">
              <SearchFilterSmall onFilterClick={expand} />
            </div>
          )}
        </SearchDesktop>
        <div className="absolute top-7 right-7">
          <div className="gap-044 flex h-8 items-center">
            <ContactButton />
            <FeedbackButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderDesktop;
