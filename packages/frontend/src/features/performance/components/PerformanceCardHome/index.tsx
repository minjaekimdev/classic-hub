import React from "react";
import PerformanceCardText from "../PerformanceCardAlbumText";
import PerformanceCardHomePrice from "../PerformanceCardHomePrice";
import type { HomePerformanceRankingItem } from "@/entities/performance";
import styles from "./PerformanceCardHome.module.scss";

interface PerformanceCardHomeProps {
  data: HomePerformanceRankingItem;
}

const PerformanceCardHome: React.FC<PerformanceCardHomeProps> = ({
  data
}) => {
  return (
    <div className={styles.performanceCardHome}>
      <div className={styles.performanceCardHome__posterWrap}>
        <img
          className={styles.performanceCardHome__poster}
          src={data.imgSrc}
          alt=""
        />
      </div>
      <div className={styles.performanceCardHome__info}>
        <div className={styles.performanceCardHome__infoWrap}>
          <PerformanceCardText
            title={data.title}
            artist={data.artist}
            date={data.date}
            time={data.time}
            location={data.location}
          />
          <PerformanceCardHomePrice price={data.price} />
        </div>
      </div>
    </div>
  );
};

export default PerformanceCardHome;
