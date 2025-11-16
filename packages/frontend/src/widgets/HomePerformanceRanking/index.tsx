import React from "react";
import "@app/styles/main.scss";
import styles from "./HomePerformanceRanking.module.scss";
import rankingIcon from "@shared/assets/icons/ranking-red.svg";
import type { PerformanceDataSimple } from "@root-shared/model/performance.front";
import HomePerformanceAlbumItem from "@/features/performance/components/HomePerformanceAlbumItem";
import HomeWidgetHeader from "@/shared/ui/HomeWidgetHeader";

interface HomePerformanceRankingProps {
  performanceArray: PerformanceDataSimple[];
}

const HomePerformanceRanking: React.FC<HomePerformanceRankingProps> = ({
  performanceArray,
}) => {
  return (
    <div className={styles.ranking}>
      <div className={styles.ranking__wrapper}>
        <HomeWidgetHeader
          icon={rankingIcon}
          mainTitle="오늘의 공연 랭킹"
          subTitle="티켓판매액 기준 인기 공연"
        />
        <ul className={styles.ranking__list}>
          {performanceArray.map((performance) => (
            <HomePerformanceAlbumItem
              key={performance.rank}
              data={performance}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HomePerformanceRanking;
