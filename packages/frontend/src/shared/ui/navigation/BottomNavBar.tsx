import searchIcon from "@shared/assets/icons/search-nav.svg";
import searchActiveIcon from "@shared/assets/icons/search-nav-red.svg";
import rankingIcon from "@shared/assets/icons/ranking-nav.svg";
import rankingActiveIcon from "@shared/assets/icons/ranking-red.svg";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type NavContent = "검색" | "랭킹";

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
      className="py-044 gap-022 flex w-24 cursor-pointer flex-col items-center"
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
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/ranking") {
      setActive("랭킹");
    } else {
      setActive("검색");
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const handleSearchClick = () => {
    if (location.pathname === "/ranking") {
      navigate("/");
    } else if (location.pathname === "/result") {
      navigate("/");
    }
    // Home에서는 변화 없음
  };

  const NAV_ITEMS: NavItem[] = [
    {
      id: "검색",
      iconSrc: searchIcon,
      iconActiveSrc: searchActiveIcon,
      action: handleSearchClick,
    },
    {
      id: "랭킹",
      iconSrc: rankingIcon,
      iconActiveSrc: rankingActiveIcon,
      action: () => {
        navigate("/ranking");
      },
    },
  ];

  return (
    <>
      {isVisible && (
        <div className="gap-022 p-044 fixed bottom-0 z-70 flex w-full justify-center border-t bg-white">
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
      )}
    </>
  );
};

export default BottomNavBar;
