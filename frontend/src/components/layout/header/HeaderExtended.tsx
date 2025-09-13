import React from "react";
import styles from "./HeaderExtended.module.scss";
import Logo from "./Logo";
import Filter from "@/components/layout/header/filter/Filter";
import NavBar from "./NavBar";
import Auth from "./Auth";

const Header: React.FC = () => {
  return (
    <div className={styles["header-extended"]}>
      <header className={styles.header}>
        <Logo />
        <NavBar />
        <Auth />
      </header>
      <Filter />
    </div>
  );
};

export default Header;
