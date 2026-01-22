import trophyIcon from "@shared/assets/icons/trophy-gold.svg";
import RankingItem from "@/features/ranking/components/RankingItem";
import type { Period, RankingPerformance } from "@classic-hub/shared/types/client";
import { PERIOD_LABEL } from "../constants/period-label";

interface RankingListProps {
  period: Period;
  data: RankingPerformance[];
}

const RankingList = ({ period, data }: RankingListProps) => {
  return (
    <div className="flex flex-col rounded-[0.8rem] border border-[rgba(0,0,0,0.1)]">
      <div className="p-[1.38rem]">
      <div className="flex gap-[0.44rem] items-center">
        <img src={trophyIcon} alt="트로피 아이콘" />
        <span className="dark text-[0.88rem]">{PERIOD_LABEL[period]} 인기 공연 Top 50</span>
      </div>
    </div>
      <div className="flex flex-col gap-[0.88rem] px-[1.31rem] pb-[1.38rem]">
        {data.map((item) => (
          <RankingItem
            id={item.id}
            currentRank={item.current_rank}
            lastRank={item.last_rank}
            title={item.title}
            poster={item.poster}
            artist={item.artist}
            period={item.period}
            venue={item.venue}
            bookingLinks={item.bookingLinks}
          />
        ))}
      </div>
    </div>
  );
};

export default RankingList;
