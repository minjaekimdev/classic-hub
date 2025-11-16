import React from "react";
import "@app/styles/main.scss";
import styles from "./HomePerformanceRanking.module.scss";
import rankingIcon from "@shared/assets/icons/ranking-red.svg";
import rightArrow from "@shared/assets/icons/right-arrow-red.svg";
import type { PerformanceDataSimple } from "@root-shared/model/performance.front";
import HomePerformanceRankingItem from "@/features/performance/components/HomePerformanceRankingItem";

const Header = () => {
  return (
    <div className={styles.ranking__header}>
      <div className={styles.ranking__title}>
        <img className={styles.ranking__logo} src={rankingIcon} alt="" />
        <div className={styles.ranking__headerText}>
          <h1 className={styles.ranking__mainTitle}>오늘의 공연 랭킹</h1>
          <span className={styles.ranking__subTitle}>
            티켓판매액 기준 인기 공연
          </span>
        </div>
      </div>
      <div className={styles.ranking__seeAll}>
        더보기
        <img src={rightArrow} alt="" />
      </div>
    </div>
  );
};

interface HomePerformanceRankingProps {
  performanceArray: PerformanceDataSimple[];
}

const HomePerformanceRanking: React.FC<HomePerformanceRankingProps> = ({
  performanceArray,
}) => {
  return (
    <div className={styles.ranking}>
      <div className={styles.ranking__wrapper}>
        <Header />
        <ul className={styles.ranking__list}>
          {performanceArray.map((performance) => (
            <HomePerformanceRankingItem
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
