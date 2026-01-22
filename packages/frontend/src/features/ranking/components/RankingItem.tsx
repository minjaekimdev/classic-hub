import calendarIcon from "@shared/assets/icons/calendar-gray.svg";
import crownIcon from "@shared/assets/icons/crown-gold.svg";
import medalIcon from "@shared/assets/icons/medal-silver.svg";
import badgeIcon from "@shared/assets/icons/badge-bronze.svg";
import type { Performance } from "@classic-hub/shared/types/client";
import Modal, { useModal } from "@/shared/ui/modals/Modal";
import type { BookingLink } from "@classic-hub/shared/types/common";

const Rank = ({ rank }: { rank: number }) => {
  let backgroundStyle =
    "bg-[linear-gradient(135deg,#f1f5f9_0%,#e2e8f0_100%)] shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]";

  let iconSrc = "";

  switch (rank) {
    case 1:
      iconSrc = crownIcon;
      backgroundStyle =
        "bg-[linear-gradient(135deg,#FDC700_0%,#F0B100_50%,#D08700_100%)] " +
        "shadow-[0_0_0_2px_rgba(253,199,0,0.30),0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)]";
      break;

    case 2:
      iconSrc = medalIcon;
      backgroundStyle =
        "bg-[linear-gradient(135deg,#CAD5E2_0%,#90A1B9_50%,#62748E_100%)] " +
        "shadow-[0_0_0_2px_rgba(202,213,226,0.30),0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)]";
      break;

    case 3:
      iconSrc = badgeIcon;
      backgroundStyle =
        "bg-[linear-gradient(135deg,#FE9A00_0%,#E17100_50%,#BB4D00_100%)] " +
        "shadow-[0_0_0_2px_rgba(255,185,0,0.30),0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)]";
      break;
  }

  return (
    <div
      className={`shrink-0 w-[2.19rem] h-[2.19rem] flex justify-center items-center rounded-full ${backgroundStyle}`}
    >
      {iconSrc ? (
        <img src={iconSrc} alt="공연 랭킹" />
      ) : (
        <span className="text-[#717182] text-[0.98rem]/[1.53rem] font-semibold">
          {rank}
        </span>
      )}
    </div>
  );
};

interface RankingItemProps extends Performance {
  bookingLinks: BookingLink[];
  rank: number;
}

const RankingItem = ({
  rank,
  poster,
  title,
  artist,
  period,
  venue,
  bookingLinks,
}: RankingItemProps) => {
  const {sendData} = useModal();
  return (
    <div className="flex gap-[0.88rem] items-center rounded-main px-[0.66rem] h-[6.34rem] cursor-pointer hover:bg-[rgba(236,236,240,0.5)]">
      <Rank rank={rank} />
      <div className="shrink-0 w-14 h-[4.67rem] rounded-[0.22rem] overflow-hidden">
        <img className="w-full h-full" src={poster}></img>
      </div>
      <div className="grow">
        <ul className="flex flex-col ">
          <li className="mb-[0.16rem] text-dark text-[0.77rem]/[1.09rem] font-semibold">
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
      <Modal.Trigger>
        <button className="shrink-0 justify-center items-center px-[0.43rem] py-[0.40rem] bg-main rounded-button text-white text-[0.77rem]/[1.09rem] font-medium"
        onClick={() => sendData(bookingLinks)}
        >
          예매하기
        </button>
      </Modal.Trigger>
    </div>
  );
};

export default RankingItem;
