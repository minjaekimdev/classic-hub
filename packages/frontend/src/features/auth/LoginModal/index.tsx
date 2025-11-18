import React from 'react';
import styles from "./LoginModal.module.scss";

const LoginModal = () => {
  return (
    <div className={styles.loginModal}>
      <div className={styles.loginModal__header}>
        <h3 className={styles.headerText}></h3>
        <span className={styles.subText}></span>
      </div>
      <form className={styles.loginModal__form}>
      </form>
    </div>
  );
};

export default LoginModal;
