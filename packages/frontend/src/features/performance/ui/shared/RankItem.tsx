import calendarIcon from "@shared/assets/icons/calendar-gray.svg";
import type { Performance } from "@classic-hub/shared/types/client";
import Modal, { useModal } from "@/shared/ui/modal/Modal";
import type { BookingLink } from "@classic-hub/shared/types/common";
import RankChange from "./RankChange";
import { First, Other, Second, Third } from "./Rank";

interface RankingItemProps extends Performance {
  currentRank: number;
  lastRank: number | null;
  bookingLinks: BookingLink[];
}

const showRanking = (rank: number) => {
  switch (rank) {
    case 1:
      return <First />;
    case 2:
      return <Second />;
    case 3:
      return <Third />;
    default:
      return <Other rank={rank} />;
  }
};

const RankingItem = ({
  currentRank,
  lastRank,
  poster,
  title,
  artist,
  period,
  venue,
  bookingLinks,
}: RankingItemProps) => {
  const { sendData } = useModal();
  return (
    <div className="flex gap-[0.88rem] items-center rounded-main tablet:px-[0.66rem] h-[6.34rem] cursor-pointer hover:bg-[rgba(236,236,240,0.5)]">
      {showRanking(currentRank)}
      {/* <RankBadge rank={currentRank} /> */}
      <div className="shrink-0 w-14 h-[4.67rem] rounded-[0.22rem] overflow-hidden">
        <img className="w-full h-full" src={poster}></img>
      </div>
      <div className="grow flex justify-between items-center">
        <ul className="flex flex-col">
          <li className="mb-[0.16rem] text-dark text-[0.77rem]/[1.09rem] overflow-hidden line-clamp-1 font-semibold">
            {title}
          </li>
          <li className="mb-[0.44rem] ranking-info-text">{artist}</li>
          <li className="flex gap-[0.22rem] items-center mb-[0.56rem]">
            <img src={calendarIcon} />
            <span className="ranking-info-text">{period}</span>
          </li>
          <li className="ranking-info-text">{venue}</li>
        </ul>
      </div>
      <div className="hidden desktop:block">
        <RankChange currentRank={currentRank} lastRank={lastRank} />
      </div>
      <div className="hidden tablet:block shrink-0">
        <Modal.Trigger>
          <button
            className="justify-center items-center px-[0.43rem] py-[0.40rem] bg-main rounded-button text-white text-[0.77rem]/[1.09rem] font-medium"
            onClick={() => sendData(bookingLinks)}
          >
            예매하기
          </button>
        </Modal.Trigger>
      </div>
    </div>
  );
};

export default RankingItem;
