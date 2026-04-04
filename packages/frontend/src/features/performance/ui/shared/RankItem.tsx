import calendarIcon from "@shared/assets/icons/calendar-gray.svg";
import { useModal } from "@/app/providers/modal/useModal";
import RankChange from "./RankChange";
import { First, Other, Second, Third } from "./Rank";
import type { RankingPerformance } from "@classic-hub/shared/types/client";
import { MODAL_TYPES } from "@/app/providers/modal/types";
import { Link } from "react-router-dom";

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
  id,
  currentRank,
  lastRank,
  poster,
  title,
  artist,
  period,
  venue,
  bookingLinks,
}: RankingPerformance) => {
  const { openModal } = useModal();
  return (
    <Link to={`/detail/${id}`} target="_blank">
      <div className="gap-088 rounded-main tablet:px-066 flex h-[6.34rem] cursor-pointer items-center hover:bg-[rgba(236,236,240,0.5)]">
        {showRanking(currentRank)}
        <div className="h-[4.67rem] w-14 shrink-0 overflow-hidden rounded-[0.22rem]">
          <img className="h-full w-full" src={poster ?? ""}></img>
        </div>
        <div className="flex grow items-center justify-between">
          <ul className="flex flex-col">
            <li className="text-dark mb-[0.16rem] line-clamp-1 overflow-hidden text-[0.77rem]/[1.09rem] font-semibold">
              {title}
            </li>
            <li className="ranking-info-text mb-[0.44rem]">{artist}</li>
            <li className="gap-022 mb-[0.56rem] flex items-center">
              <img src={calendarIcon} />
              <span className="ranking-info-text">{period}</span>
            </li>
            <li className="ranking-info-text">{venue}</li>
          </ul>
        </div>
        <div className="desktop:block hidden">
          <RankChange currentRank={currentRank} lastRank={lastRank} />
        </div>
        <div className="tablet:block hidden shrink-0">
          <button
            className="bg-main rounded-button items-center justify-center px-[0.43rem] py-[0.40rem] text-[0.77rem]/[1.09rem] font-medium text-white"
            onClick={() =>
              openModal(MODAL_TYPES.BOOKING, { bookingLinks: bookingLinks })
            }
          >
            예매하기
          </button>
        </div>
      </div>
    </Link>
  );
};

export default RankingItem;
