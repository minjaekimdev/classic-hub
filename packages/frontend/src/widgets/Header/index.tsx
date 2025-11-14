import React from "react";
import { useState } from "react";
import "@/app/styles/main.scss";
import styles from "./Header.module.scss";
import logoIcon from "@shared/assets/icons/logo.svg";
import homeInactive from "@shared/assets/icons/home-inactive.svg";
import homeActive from "@shared/assets/icons/home-active.svg";
import rankingInactive from "@shared/assets/icons/ranking-inactive.svg";
import rankingActive from "@shared/assets/icons/ranking-active.svg";
import searchIcon from "@shared/assets/icons/search-gray.svg";
import useWindowSize from "@/shared/hooks/useWindowSize";

const Logo = () => {
  return (
    <div className={styles.logo}>
      <img className={styles.logo__icon} src={logoIcon} alt="" />
      <h1 className={styles.logo__name}>ClassicHub</h1>
    </div>
  );
};

const MenuBar = () => {
  const [isActive, setIsActive] = useState("홈");
  return (
    <div className={styles.menuBar}>
      <div
        className={`${styles.menuBar__item} ${
          isActive === "홈" ? styles["menuBar__item--active"] : ""
        }`}
        onClick={() => setIsActive("홈")}
      >
        <img
          src={isActive === "홈" ? homeActive : homeInactive}
          alt=""
          className={styles.menuBar__icon}
        />
        <span className={styles.menuBar__text}>홈</span>
      </div>
      <div
        className={`${styles.menuBar__item} ${
          isActive === "랭킹" ? styles["menuBar__item--active"] : ""
        }`}
        onClick={() => setIsActive("랭킹")}
      >
        <img
          src={isActive === "랭킹" ? rankingActive : rankingInactive}
          alt=""
          className={styles.menuBar__icon}
        />
        <span className={styles.menuBar__text}>랭킹</span>
      </div>
    </div>
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
  const windowWidth = useWindowSize();
  const isMobile = windowWidth < 750;

  return (
    <div className={styles.header}>
      {isMobile ? <MobileMenu /> : <FullMenu />}
    </div>
  );
};

export default Header;
