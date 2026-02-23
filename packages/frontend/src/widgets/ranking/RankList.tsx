import trophyIcon from "@shared/assets/icons/trophy-gold.svg";
import type { Period } from "@classic-hub/shared/types/client";
import { PERIOD_LABEL } from "@/features/performance/constants/ranking-period-label";
import RankingItem from "@/features/performance/ui/shared/RankItem";
import { useRankingPerformances } from "@/features/performance/api/hooks/useRankingPerformances";
import RankingItemSkeleton from "@/features/performance/ui/shared/RankItemSkeleton";
import { ErrorMessageWithRefetch } from "@/shared/ui/fallback/ErrorMessage";

const RankList = ({ period }: { period: Period }) => {
  const { data, isLoading, isError, refetch } = useRankingPerformances(period);

  return (
    <div className="flex flex-col rounded-[0.8rem] border border-[rgba(0,0,0,0.1)]">
      <div className="p-[1.38rem]">
        <div className="flex gap-[0.44rem] items-center">
          <img src={trophyIcon} alt="트로피 아이콘" />
          <span className="dark text-[0.88rem]">
            {PERIOD_LABEL[period]} 인기 공연 Top 50
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-[0.88rem] px-[1.31rem] pb-[1.38rem]">
        {isLoading ? (
          Array.from({ length: 50 }).map((_, index) => (
            <RankingItemSkeleton key={`skeleton-${index}`} />
          ))
        ) : isError ? (
          <ErrorMessageWithRefetch refetch={refetch} />
        ) : (
          data?.map((item) => (
            <RankingItem
              id={item.id}
              currentRank={item.currentRank}
              lastRank={item.lastRank}
              title={item.title}
              poster={item.poster}
              artist={item.artist}
              period={period}
              venue={item.venue}
              bookingLinks={item.bookingLinks}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default RankList;
