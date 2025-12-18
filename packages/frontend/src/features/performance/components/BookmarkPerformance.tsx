import type { PerformanceType } from "@classic-hub/shared/types/performance";
import ticketIcon from "@shared/assets/icons/ticket-white.svg";
import deleteIcon from "@shared/assets/icons/trashcan-black.svg";
import calendarIcon from "@shared/assets/icons/calendar-gray.svg";
import locationIcon from "@shared/assets/icons/location-gray.svg";

interface MetaProps {
  iconSrc: string;
  text: string;
}

const Meta = ({ iconSrc, text }: MetaProps) => {
  return (
    <li className="flex items-center gap-[0.44rem]">
      <img src={iconSrc} alt="달력 아이콘" className="" />
      <span className="text-[#0a0a0a] text-[0.77rem]/[1.09rem]">{text}</span>
    </li>
  );
};

const BookmarkPerformance = ({
  posterUrl,
  name,
  artist,
  date,
  hall,
}: PerformanceType) => {
  return (
    <div className="flex flex-col border border-[rgba(0,0,0,0.1)] rounded-[0.8rem] overflow-hidden bg-white w-full">
      <div
        className="w-full border aspect-10/14 overflow-hidden"
      >
        <img src={posterUrl} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col pt-[0.55rem] pb-[1.31rem] px-[0.66rem]">
        <ul className="flex flex-col gap-1">
          <li className="truncate text-[#0a0a0a] text-[0.88rem]/[1.31rem] font-semibold">
            {name}
          </li>
          <li className="text-[#717182] text-[0.77rem]/[1.09rem]">{artist}</li>
        </ul>
        <div className="bg-[rgba(0,0,0,0.1)] my-[0.44rem] w-full h-[0.06rem] "></div>
        <ul className="flex flex-col gap-[0.16rem]">
          <Meta iconSrc={calendarIcon} text={date} />
          <Meta iconSrc={locationIcon} text={hall} />
        </ul>
        <div className="flex gap-[0.44rem] mt-[0.88rem]">
          <button className="flex justify-center items-center gap-[0.36rem] rounded-[0.42rem] bg-main w-[20.66rem] h-7">
            <img src={ticketIcon} alt="" className="" />
            <span className="text-white text-[0.77rem]/[1.09rem]">
              예매하기
            </span>
          </button>
          <button className="flex justify-center items-center rounded-[0.42rem] border border-[rgba(0,0,0,0.1)] bg-white w-[2.09rem] h-7">
            <img src={deleteIcon} alt="휴지통 아이콘" className="" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookmarkPerformance;
