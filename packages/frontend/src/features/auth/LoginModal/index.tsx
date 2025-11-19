import React from "react";
import styles from "./LoginModal.module.scss";
import ModalHeader from "@/shared/ui/ModalHeader";
import FormField from "@/shared/ui/FormField";
import Modal from "@/shared/ui/Modal";
import googleIcon from "@shared/assets/icons/auth-google.svg";

const LoginModal = () => {
  return (
    <Modal>
      <div className={styles.loginModal}>
        <ModalHeader
          main="로그인"
          sub="ClassicHub에 로그인하여 더 많은 기능을 이용하세요"
        />
        <form className={styles.loginModal__content}>
          <FormField
            isSingleLine={true}
            id="email"
            label="이메일"
            placeHolder="example@email.com"
            verticalPadding="0.22rem"
            inputAreaHeight="1.53rem"
          />
          <FormField
            isSingleLine={true}
            id="password"
            label="비밀번호"
            placeHolder="••••••••"
            verticalPadding="0.22rem"
            inputAreaHeight="1.53rem"
          />
          <a href="#" className={styles.loginModal__forgotPassword}>
            비밀번호를 잊으셨나요?
          </a>
          <button className={styles.authButton}>로그인</button>
          <div className={styles.or}>또는</div>
          <button className={styles.oAuthButton}>
            <img src={googleIcon} alt="" />
            Google로 로그인
          </button>
          <div className={styles.authPrompt}>
            <span className={styles.authPrompt__text}>
              이미 계정이 있으신가요?
            </span>
            <a className={styles.authPrompt__button} href="#">
              회원가입
            </a>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default LoginModal;
