import ticketIcon from "@shared/assets/icons/ticket-white.svg";
import type { Price } from "@classic-hub/shared/types/common";
import { useDetail } from "../../contexts/detail-context";
import { useModal } from "@/app/providers/modal/useModal";

interface ItemProps {
  seat: string;
  price: number;
}
const PriceItem = ({ seat, price }: ItemProps) => {
  return (
    <div className="rounded-main flex h-[2.63rem] items-center justify-between bg-[#f9fafb] px-[0.66rem]">
      <span className="text-dark text-[0.88rem]/[1.31rem] font-medium">
        {seat}
      </span>
      <span className="text-main text-[0.88rem]/[1.31rem] font-bold">
        {price.toLocaleString()}원
      </span>
    </div>
  );
};

const PriceInfoDesktop = () => {
  const { bookingLinks, priceInfo } = useDetail();
  const { openModal } = useModal();

  return (
    <div className="rounded-main sticky top-[6.8rem] p-[1.31rem] shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <p className="text-dark text-[0.98rem]/[1.53rem] font-semibold">
        좌석 및 가격 정보
      </p>
      <div className="mt-088">
        <div className="p-088 desktop:p-0 flex flex-col gap-[0.44rem]">
          {priceInfo.map((item: Price) => (
            <PriceItem seat={item.seatType} price={item.price} />
          ))}
        </div>
      </div>
      <div className="my-[1.31rem] h-px bg-black/10"></div>
      <button
        className="rounded-button bg-main flex w-full items-center justify-center gap-3 pt-[0.73rem] pb-[0.77rem] text-[0.98rem]/[1.53rem] font-semibold text-white"
        onClick={() => openModal("BOOKING", { bookingLinks })}
      >
        <img src={ticketIcon} alt="" className="w-088 h-088" />
        예매하기
      </button>
    </div>
  );
};

export default PriceInfoDesktop;
