import styles from "./LoginModal.module.scss";
import ModalHeader from "@/shared/ui/ModalHeader";
import FormField from "@/shared/ui/FormField";
import Modal from "@/shared/ui/Modal";
import googleLogo from "@shared/assets/logos/google.svg";
import AuthButton from "../AuthButton";
import OAuthButton from "../OAuthButton";

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
            required={true}
          />
          <FormField
            isSingleLine={true}
            id="password"
            label="비밀번호"
            placeHolder="••••••••"
            verticalPadding="0.22rem"
            inputAreaHeight="1.53rem"
            required={true}
          />
          <a href="#" className={styles.loginModal__forgotPassword}>
            비밀번호를 잊으셨나요?
          </a>
          <AuthButton>로그인</AuthButton>
          <div className={styles.or}>
            <div className={styles.or__line}></div>
            <span className={styles.or__text}>또는</span>
          </div>
          <OAuthButton iconSrc={googleLogo}>Google로 로그인</OAuthButton>
        </form>
      </div>
    </Modal>
  );
};

export default LoginModal;
