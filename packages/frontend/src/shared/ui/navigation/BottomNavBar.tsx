import searchIcon from "@shared/assets/icons/search-nav.svg";
import searchActiveIcon from "@shared/assets/icons/search-nav-red.svg";
import rankingIcon from "@shared/assets/icons/ranking-nav.svg";
import rankingActiveIcon from "@shared/assets/icons/ranking-red.svg";
import feedbackIcon from "@shared/assets/icons/speech-bubble-nav.svg";
import feedbackActiveIcon from "@shared/assets/icons/feedback-nav-red.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useModal } from "@/app/providers/modal/useModal";

type NavContent = "검색" | "랭킹" | "의견 제안";

interface ComponentProps {
  iconSrc: string;
  iconActiveSrc: string;
  isActive: boolean;
  text: string;
  onClick?: () => void;
}
const Component = ({
  iconSrc,
  text,
  iconActiveSrc,
  isActive,
  onClick,
}: ComponentProps) => {
  const src = isActive ? iconActiveSrc : iconSrc;
  return (
    <div
      className="py-044 gap-022 flex flex-1 cursor-pointer flex-col items-center"
      onClick={onClick}
    >
      <img src={src} alt="" className="bottom-nav-icon" />
      <span className={`bottom-nav-text ${isActive ? "text-main" : ""}`}>
        {text}
      </span>
    </div>
  );
};

interface NavItem {
  id: NavContent;
  iconSrc: string;
  iconActiveSrc: string;
  action: () => void;
}

const BottomNavBar = () => {
  const [active, setActive] = useState<NavContent>("검색");
  const navigate = useNavigate();
  const { openModal } = useModal();

  const NAV_ITEMS: NavItem[] = [
    {
      id: "검색",
      iconSrc: searchIcon,
      iconActiveSrc: searchActiveIcon,
      action: () => {},
    },
    {
      id: "랭킹",
      iconSrc: rankingIcon,
      iconActiveSrc: rankingActiveIcon,
      action: () => {
        navigate("/ranking");
      },
    },
    {
      id: "의견 제안",
      iconSrc: feedbackIcon,
      iconActiveSrc: feedbackActiveIcon,
      action: () => {
        openModal("FEEDBACK", {});
      },
    },
  ];

  return (
    <div className="gap-022 p-044 fixed bottom-0 flex w-full border-t bg-white z-99">
      {NAV_ITEMS.map((item) => (
        <Component
          key={item.id}
          text={item.id}
          iconSrc={item.iconSrc}
          iconActiveSrc={item.iconActiveSrc}
          isActive={active === item.id}
          onClick={() => {
            setActive(item.id);
            item.action();
          }}
        />
      ))}
    </div>
  );
};

export default BottomNavBar;
