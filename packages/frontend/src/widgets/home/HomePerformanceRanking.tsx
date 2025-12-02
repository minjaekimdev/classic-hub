import React from "react";
import rankingIcon from "@shared/assets/icons/ranking-red.svg";
import type { PerformanceDataSimple } from "@/shared/model/performance.front";
import HomeWidgetHeader from "@/shared/ui/HomeWidgetHeader";
import DesktopItem from "@/features/performance/components/HomePerformanceAlbumItem";

interface HomePerformanceRankingProps {
  performanceArray: PerformanceDataSimple[];
}

const HomePerformanceRanking: React.FC<HomePerformanceRankingProps> = ({
  performanceArray,
}) => {
  return (
    <div className="w-full">
      <div className="flex flex-col items-center gap-[1.31rem] mx-auto max-w-7xl">
        <HomeWidgetHeader
          icon={rankingIcon}
          mainTitle="오늘의 공연 랭킹"
          subTitle="티켓판매액 기준 인기 공연"
        />
        <ul className="grid grid-cols-5 gap-[1.31rem] w-[calc(100%-3.5rem)]">
          {performanceArray.map((performance) => (
            <DesktopItem data={performance} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HomePerformanceRanking;
