import React from "react";

const AuthPrompt = () => {
  return (
    <div className={styles.authPrompt}>
      <span className={styles.authPrompt__text}>이미 계정이 있으신가요?</span>
      <a className={styles.authPrompt__button} href="#">
        회원가입
      </a>
    </div>
  );
};

export default AuthPrompt;
