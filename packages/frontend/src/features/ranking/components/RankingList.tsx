import trophyIcon from "@shared/assets/icons/trophy-gold.svg";
import RankingItem from "@/features/ranking/components/RankingItem";
import type { RankingPerformance } from "@classic-hub/shared/types/client";

const RankingListHeader = () => {
  return (
    <div className="p-[1.38rem]">
      <div className="flex gap-[0.44rem] items-center">
        <img src={trophyIcon} alt="트로피 아이콘" />
        <span className="dark text-[0.88rem]">월간 인기 공연 Top 50</span>
      </div>
    </div>
  );
};

const RankingList = ({ data }: { data: RankingPerformance[] }) => {
  return (
    <div className="flex flex-col rounded-[0.8rem] border border-[rgba(0,0,0,0.1)]">
      <RankingListHeader />
      <div className="flex flex-col gap-[0.88rem] px-[1.31rem] pb-[1.38rem]">
        {data.map((item) => (
          <RankingItem
            id={item.id}
            rank={item.rank}
            title={item.title}
            poster={item.poster}
            artist={item.artist}
            period={item.period}
            venue={item.venue}
          />
        ))}
      </div>
    </div>
  );
};

export default RankingList;
