import Modal, { useModal } from "@/shared/ui/modals/Modal";
import ticketIcon from "@shared/assets/icons/ticket-white.svg";
import { useDetail } from "@/pages/Detail";
import type { Price } from "@classic-hub/shared/types/common";

interface ItemProps {
  seat: string;
  price: number;
}
const PriceItem = ({ seat, price }: ItemProps) => {
  return (
    <div className="flex justify-between items-center rounded-main bg-[#f9fafb] px-[0.66rem] h-[2.63rem]">
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
  const { sendData } = useModal();

  return (
    <div className="sticky top-[6.8rem] rounded-main shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] p-[1.31rem]">
      <p className="text-dark text-[0.98rem]/[1.53rem] font-semibold">
        좌석 및 가격 정보
      </p>
      <div className="mt-[0.88rem]">
        <div className="flex flex-col gap-[0.44rem] p-[0.88rem] desktop:p-0">
          {priceInfo.map((item: Price) => (
            <PriceItem seat={item.seatType} price={item.price} />
          ))}
        </div>
      </div>
      <div className="h-px bg-black/10 my-[1.31rem]"></div>
      <Modal.Trigger>
        <button
          className="flex justify-center items-center gap-3 rounded-button bg-main w-full pt-[0.73rem] pb-[0.77rem] text-white text-[0.98rem]/[1.53rem] font-semibold"
          onClick={() => sendData(bookingLinks)}
        >
          <img src={ticketIcon} alt="" className="w-[0.88rem] h-[0.88rem]" />
          예매하기
        </button>
      </Modal.Trigger>
    </div>
  );
};

export default PriceInfoDesktop;
