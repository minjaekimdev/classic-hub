import React from "react";
import styles from "./NavBar.module.scss";
import rankingIcon from "@assets/header/ranking_icon.svg";
import bookmarkIcon from "@assets/header/bookmark_icon.svg";
import drodownArrow from "@assets/header/header_dropdown.svg";

const NavBar: React.FC = () => {
  return (
    <div className={styles.nav}>
      <div className={styles.nav__container}>
        <div className={styles.nav__wrapper}>
          <img className={styles.icon} src={rankingIcon} alt="" />
          <span className={styles.text}>공연 랭킹</span>
          <img src={drodownArrow} alt="" />
        </div>
      </div>
      <div className={styles.nav__container}>
        <img className={styles.icon} src={bookmarkIcon} alt="" />
        <div className={styles.nav__wrapper}>
          <span className={styles.text}>내가 찜한 공연</span>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
