import React from "react";
import styles from "./Logo.module.scss";
import logoIcon from "@assets/header/logo_piano.svg";

const Logo: React.FC = () => {
  return (
    <div className={styles.logo}>
      <img
        className={styles.im}
        src={logoIcon}
        alt="로고"
      />
      <div className={styles.logo__title}>ClassicHub</div>
    </div>
  );
};

export default Logo;
