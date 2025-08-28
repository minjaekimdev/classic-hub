import React from "react";
import styles from "./RankingHeader.module.scss";
import type { RankingPeriod } from "@/models/ranking.client";

interface RankingHeaderProps {
  onPeriodChange: (period: RankingPeriod) => void;
  period: string;
}

const RankingHeader: React.FC<RankingHeaderProps> = ({ onPeriodChange, period }) => {
  return (
    <div className={styles["ranking-header"]}>
      <div className={styles["ranking-title"]}>
        <h1 className={styles["ranking-title__main"]}>공연 랭킹</h1>
        <p className={styles["ranking-title__sub"]}>
          가장 인기 있는 클래식 공연을 확인해보세요
        </p>
      </div>
      <div className={styles["ranking-options"]}>
        <button
          className={`${styles["ranking-options__period"]} ${period === "daily" ? styles["ranking-options__period--focused"] : ""}`}
          onClick={() => {
            onPeriodChange("daily");
          }}
        >
          일간
        </button>
        <button
          className={`${styles["ranking-options__period"]} ${period === "weekly" ? styles["ranking-options__period--focused"] : ""}`}
          onClick={() => {
            onPeriodChange("weekly");
          }}
        >
          주간
        </button>
        <button
          className={`${styles["ranking-options__period"]} ${period === "monthly" ? styles["ranking-options__period--focused"] : ""}`}
          onClick={() => onPeriodChange("monthly")}
        >
          월간
        </button>
      </div>
    </div>
  );
};

export default RankingHeader;
