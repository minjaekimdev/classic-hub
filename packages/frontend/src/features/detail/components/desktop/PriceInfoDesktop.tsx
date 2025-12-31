import PriceInfo from "../shared/PriceInfo";
import ticketIcon from "@shared/assets/icons/ticket-white.svg";

const PriceInfoDesktop = () => {
  return (
    <div className="sticky top-0 rounded-main shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] p-[1.31rem]">
      <p className="text-dark text-[0.98rem]/[1.53rem] font-semibold">
        좌석 및 가격 정보
      </p>
      <div className="mt-[0.88rem]">
        <PriceInfo />
      </div>
      <div className="h-px bg-black/10 my-[1.31rem]"></div>
      <button className="flex justify-center items-center gap-3 rounded-button bg-main w-full pt-[0.73rem] pb-[0.77rem] text-white text-[0.98rem]/[1.53rem] font-semibold">
        <img src={ticketIcon} alt="" className="w-[0.88rem] h-[0.88rem]" />
        예매하기
      </button>
    </div>
  );
};

export default PriceInfoDesktop;
