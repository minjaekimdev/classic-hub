import Modal from "@/shared/ui/modal/Modal";
import AuthButton from "./AuthButton";
import OAuthButton from "./OAuthButton";
import googleLogo from "@shared/assets/logos/google.svg";
import ModalHeader from "@/shared/ui/modal/ModalHeader";
import FormField from "@/shared/ui/modal/FormField";

const SignupModal = () => {
  return (
    <div>
      <Modal>
        <div className="flex flex-col gap-7">
          <ModalHeader
            main="회원가입"
            sub="ClassicHub 회원이 되어 다양한 공연을 즐겨보세요"
          />
          <form className="flex flex-col gap-[0.88rem]">
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
            <div className="relative h-[0.88rem]">
              <div className="absolute inset-y-0 my-auto w-full h-px bg-black/10"></div>
              <span className="absolute inset-0 m-auto w-fit h-fit bg-white pl-[0.44rem] pr-[0.32rem] z-10 text-[#717182] text-[0.66rem] leading-[0.88rem]">
                또는
              </span>
            </div>
            <OAuthButton iconSrc={googleLogo}>Google로 회원가입</OAuthButton>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default SignupModal;
