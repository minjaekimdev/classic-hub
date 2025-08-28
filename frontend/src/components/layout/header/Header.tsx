import React from 'react';
import styles from "./Header.module.scss";

const Header:React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img className={styles.im} src="/src/assets/header/logo_piano.svg" alt="로고" />
        <div className={styles.logo__title}>ClassicHub</div>
      </div>
      <div className={styles.nav}>
        <div className={styles.nav__container}>
          <div className={styles.nav__wrapper}>
            <span className={styles.text}>공연 랭킹</span>
            <img src="/src/assets/header/header_dropdown.svg" alt="" />
          </div>
        </div>
        <div className={styles.nav__container}>
          <div className={styles.nav__wrapper}>
            <span className={styles.text}>조건별 검색</span>
          </div>
        </div>
      </div>
      <div className={styles.auth}>
        <button className={`${styles['auth__button']} ${styles['auth__button-login']}`}>로그인</button>
        <button className={`${styles['auth__button']} ${styles['auth__button-register']}`}>회원가입</button>
      </div>
    </header>
  );
};

export default Header;