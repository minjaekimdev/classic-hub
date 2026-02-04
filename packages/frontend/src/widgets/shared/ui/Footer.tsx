import Modal from "@/shared/ui/modal/Modal";
import feedbackIcon from "@shared/assets/icons/feedback.svg";

const Footer = () => {
  return (
    <div className="w-full border-t border-[rgba(0,0,0,0.1)] bg-[rgba(236,236,240,0.3)]">
      <div className="flex justify-between items-center mx-auto py-[1.81rem] px-7 max-w-7xl">
        <p className="text-[#717182] text-[0.76rem]/[1.09rem]">
          이 서비스의 콘텐츠 출처는 (주)공연예술통합전산망 입니다.
        </p>
        <Modal.Trigger>
          <div className="flex justify-center items-center border border-[rgba(0,0,0,0.1)] ml-4 rounded-button p-[0.36rem_0.4rem_0.27rem_0.61rem] bg-white text-dark text-[0.76rem]/[1.09rem] font-medium cursor-pointer hover:bg-[rgb(233,235,239)]">
            <div className="flex items-center gap-[0.44rem]">
              <img src={feedbackIcon} alt="" />
              의견 제안
            </div>
          </div>
        </Modal.Trigger>
      </div>
    </div>
  );
};

export default Footer;
