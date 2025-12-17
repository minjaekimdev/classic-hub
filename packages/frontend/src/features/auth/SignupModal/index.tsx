import Modal from "@/features/modal/Modal/Modal";
import ModalHeader from "@/features/modal/ModalHeader";
import FormField from "@/features/modal/FormField";
import AuthButton from "../AuthButton";
import OAuthButton from "../OAuthButton";
import styles from "./SignupModal.module.scss";
import googleLogo from "@shared/assets/logos/google.svg";

const SignupModal = () => {
  return (
    <div>
      <Modal>
        <div className={styles.signupModal}>
          <ModalHeader
            main="회원가입"
            sub="ClassicHub 회원이 되어 다양한 공연을 즐겨보세요"
          />
          <form className={styles.signupModal__content}>
            <FormField
              isSingleLine={true}
              type="text"
              id="username"
              label="이름"
              placeHolder="홍길동"
              verticalPadding="0.22rem"
              inputAreaHeight="1.53rem"
              required={true}
            />
            <FormField
              isSingleLine={true}
              type="email"
              id="email"
              label="이메일"
              placeHolder="example@email.com"
              verticalPadding="0.22rem"
              inputAreaHeight="1.53rem"
              required={true}
            />
            <FormField
              isSingleLine={true}
              type="password"
              id="password"
              label="비밀번호"
              placeHolder="••••••••"
              verticalPadding="0.22rem"
              inputAreaHeight="1.53rem"
              required={true}
            />
            <AuthButton>회원가입</AuthButton>
            <div className={styles.or}>
              <div className={styles.or__line}></div>
              <span className={styles.or__text}>또는</span>
            </div>
            <OAuthButton iconSrc={googleLogo}>Google로 회원가입</OAuthButton>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default SignupModal;
