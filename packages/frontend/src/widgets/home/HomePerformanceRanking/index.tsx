import React from "react";

import styles from "./HomePerformanceRanking.module.scss";
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
    <div className={styles.ranking}>
      <div className={styles.ranking__wrapper}>
        <HomeWidgetHeader
          icon={rankingIcon}
          mainTitle="오늘의 공연 랭킹"
          subTitle="티켓판매액 기준 인기 공연"
        />
        <ul className={styles.ranking__list}>
          {performanceArray.map((performance) => (
            <DesktopItem data={performance} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HomePerformanceRanking;
