import React from "react";
import styles from "./HomePerformanceRanking.module.scss";
import PerformanceCardHome from "@/features/performance/components/PerformanceCardHome";
import type { HomePerformanceRankingItem } from "@/entities/performance";

interface HomePerformanceRankingProps {
  top5Array: HomePerformanceRankingItem[];
}

const HomePerformanceRanking: React.FC<HomePerformanceRankingProps> = ({
  top5Array,
}) => {
  return (
    <div className={styles.HomePerformanceRanking}>
      {top5Array.map((element) => (
        <PerformanceCardHome data={element} />
      ))}
    </div>
  );
};

export default HomePerformanceRanking;
