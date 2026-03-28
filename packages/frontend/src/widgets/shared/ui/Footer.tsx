import { MODAL_TYPES } from "@/app/providers/modal/types";
import { useModal } from "@/app/providers/modal/useModal";
import feedbackIcon from "@shared/assets/icons/feedback.svg";

const Footer = () => {
  const { openModal } = useModal();
  return (
    <div className="w-full border-t border-[rgba(0,0,0,0.1)] bg-[rgba(236,236,240,0.3)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-7 py-[1.81rem]">
        <p className="text-[0.76rem]/[1.09rem] text-[#717182]">
          이 서비스의 콘텐츠 출처는 (주)공연예술통합전산망 입니다.
        </p>
        <div
          className="rounded-button text-dark ml-4 flex cursor-pointer items-center justify-center border border-[rgba(0,0,0,0.1)] bg-white p-[0.36rem_0.4rem_0.27rem_0.61rem] text-[0.76rem]/[1.09rem] font-medium hover:bg-[rgb(233,235,239)]"
          onClick={() => openModal(MODAL_TYPES.FEEDBACK, {})}
        >
          <div className="flex items-center gap-[0.44rem]">
            <img src={feedbackIcon} alt="" />
            의견 제안
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
