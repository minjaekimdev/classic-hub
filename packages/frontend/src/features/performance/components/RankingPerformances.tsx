import React from "react";
import rankingIcon from "@shared/assets/icons/ranking-red.svg";
import type { HomePerformance } from "@classic-hub/shared/types/performance";
import HomeWidgetHeader from "@/shared/layout/HomeWidgetHeader";
import AlbumItem from "@/features/performance/components/HomeAlbumItem";

interface HomePerformanceRankingProps {
  performanceArray: HomePerformance[];
}

const HomePerformanceRanking: React.FC<HomePerformanceRankingProps> = ({
  performanceArray,
}) => {
  return (
    <div className="w-full">
      <div className="flex flex-col gap-[1.31rem] mx-auto max-w-7xl px-7">
        <HomeWidgetHeader
          icon={rankingIcon}
          mainTitle="오늘의 공연 랭킹"
          subTitle="티켓판매액 기준 인기 공연"
        />
        <ul className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 large-desktop:grid-cols-5 gap-[1.31rem] w-full">
          {performanceArray.map((performance) => (
            <AlbumItem data={performance} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HomePerformanceRanking;
