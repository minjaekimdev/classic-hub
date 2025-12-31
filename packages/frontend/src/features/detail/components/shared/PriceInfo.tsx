import type { SeatPriceInfo } from "@classic-hub/shared/types/performance";
import { useDetail } from "../../model/useDetail";

interface ItemProps {
  seat: string;
  price: number;
}
const Item = ({ seat, price }: ItemProps) => {
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

const PriceInfo = () => {
  const performance = useDetail();
  return (
    <div className="flex flex-col gap-[0.44rem] p-[0.88rem] desktop:p-0">
      {performance.priceInfo.map((item: SeatPriceInfo) => (
        <Item seat={item.seat} price={item.price} />
      ))}
    </div>
  );
};

export default PriceInfo;
