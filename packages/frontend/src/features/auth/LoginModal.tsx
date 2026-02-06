import googleLogo from "@shared/assets/logos/google.svg";
import AuthButton from "./AuthButton";
import OAuthButton from "./OAuthButton";
import Modal from "@/shared/ui/modal/Modal";
import ModalHeader from "@/shared/ui/modal/ModalHeader";
import FormField from "@/shared/ui/modal/FormField";

const LoginModal = () => {
  return (
    <Modal>
      <div className="flex flex-col gap-7">
        <ModalHeader
          main="로그인"
          sub="ClassicHub에 로그인하여 더 많은 기능을 이용하세요"
        />
        <form className="flex flex-col gap-[0.88rem]">
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
          <a href="#" className="text-main text-[0.77rem] leading-[1.09rem]">
            비밀번호를 잊으셨나요?
          </a>
          <AuthButton>로그인</AuthButton>
          <div className="relative h-[0.88rem]">
            <div className="absolute inset-y-0 my-auto w-full h-px bg-black/10"></div>
            <span className="absolute inset-0 m-auto w-fit h-fit bg-white pl-[0.44rem] pr-[0.32rem] z-10 text-[#717182] text-[0.66rem] leading-[0.88rem]">
              또는
            </span>
          </div>
          <OAuthButton iconSrc={googleLogo}>Google로 로그인</OAuthButton>
        </form>
      </div>
    </Modal>
  );
};

export default LoginModal;
