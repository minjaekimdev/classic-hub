import React from "react";
import styles from "./Auth.module.scss";

const Auth: React.FC = () => {
  return (
    <div className={styles.auth}>
      <button
        className={`${styles["auth__button"]} ${styles["auth__button-login"]}`}
      >
        로그인
      </button>
      <button
        className={`${styles["auth__button"]} ${styles["auth__button-register"]}`}
      >
        회원가입
      </button>
    </div>
  );
};

export default Auth;
