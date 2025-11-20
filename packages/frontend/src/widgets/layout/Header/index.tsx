import { useState } from "react";
import "@/app/styles/main.scss";
import styles from "./Header.module.scss";
import logoIcon from "@shared/assets/logos/service-logo.svg";
import homeInactive from "@shared/assets/icons/home-inactive.svg";
import homeActive from "@shared/assets/icons/home-active.svg";
import rankingInactive from "@shared/assets/icons/ranking-gray.svg";
import rankingActive from "@shared/assets/icons/ranking-red.svg";
import searchIcon from "@shared/assets/icons/search-gray.svg";

type MenuType = "홈" | "랭킹";

interface MenuItem {
  id: MenuType;
  label: string;
  iconActive: string;
  iconInactive: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: "홈",
    label: "홈",
    iconActive: homeActive,
    iconInactive: homeInactive,
  },
  {
    id: "랭킹",
    label: "랭킹",
    iconActive: rankingActive,
    iconInactive: rankingInactive,
  },
];

const Logo = () => {
  return (
    <div className={styles.logo}>
      <img className={styles.logo__icon} src={logoIcon} alt="" />
      <h1 className={styles.logo__name}>ClassicHub</h1>
    </div>
  );
};

interface MenuBarItemProps {
  isActive: string;
  label: string;
  iconActive: string;
  iconInactive: string;
  onClick: () => void;
}

const MenuBarItem: React.FC<MenuBarItemProps> = ({
  isActive,
  label,
  iconActive,
  iconInactive,
  onClick,
}) => {
  return (
    <div
      className={`${styles.menuBar__item} ${
        isActive === label ? styles["menuBar__item--active"] : ""
      }`}
      onClick={onClick}
    >
      <img
        src={isActive === label ? iconActive : iconInactive}
        alt=""
        className={styles.menuBar__icon}
      />
      <span
        className={`${styles.menuBar__text} ${
          isActive === label ? styles["menuBar__text--active"] : ""
        }`}
      >
        {label}
      </span>
    </div>
  );
};

const MenuBar = () => {
  const [isActive, setIsActive] = useState("홈");
  return (
    <nav className={styles.menuBar}>
      {MENU_ITEMS.map((item) => (
        <MenuBarItem
          key={item.id}
          isActive={isActive}
          label={item.label}
          iconActive={item.iconActive}
          iconInactive={item.iconInactive}
          onClick={() => setIsActive(item.label)}
        />
      ))}
    </nav>
  );
};

const Auth = () => {
  return (
    <div className={styles.auth}>
      <span className={styles.auth__login}>로그인</span>
      <span className={styles.auth__signup}>회원가입</span>
    </div>
  );
};

const FullMenu = () => {
  return (
    <div className={styles["full-menu"]}>
      <div className={styles["full-menu__main"]}>
        <Logo />
        <MenuBar />
        <Auth />
      </div>
      <div className={styles["full-menu__filter"]}></div>
    </div>
  );
};

const MobileMenu = () => {
  return (
    <div className={styles["mobile-menu"]}>
      <div className={styles["mobile-menu__wrapper"]}>
        <div className={styles["mobile-menu__search"]}>
          <img src={searchIcon} alt="" />
          <span className={styles["mobile-menu__text"]}>
            검색을 시작해 보세요
          </span>
        </div>
      </div>
    </div>
  );
};

const Header = () => {
  return (
    <div className={styles.header}>
      <MobileMenu />
      <FullMenu />
    </div>
  );
};

export default Header;
