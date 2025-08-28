import React from 'react';
import styles from './Footer.module.scss';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles["footer-text"]}>
        <p className={styles["content-origin"]}>
          이 서비스의 콘텐츠 출처는 (주)공연통합예술전산망 입니다.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
