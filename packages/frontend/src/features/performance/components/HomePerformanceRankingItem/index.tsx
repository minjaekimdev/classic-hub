import React from "react";
import styles from "./HomePerformanceRankingItem.module.scss";
import CardBadge from "@/shared/ui/CardBadge";
import Bookmark from "@/shared/ui/Bookmark";
import type { PerformanceDataSimple } from "@root-shared/model/performance.front";
import PerformanceAlbumMeta from "../PerformanceAlbumMeta";

const Card: React.FC<{ imgSrc: string; rank: string }> = ({ imgSrc, rank }) => {
  return (
    <div className={styles.card}>
      <img className={styles.card__poster} src={imgSrc} alt="" />
      <CardBadge style={{ top: "0.66rem", left: "0.66rem" }}>
        {rank}위
      </CardBadge>
      <Bookmark style={{ top: "0.66rem", right: "0.66rem" }} />
    </div>
  );
};

const Info: React.FC<Omit<PerformanceDataSimple, "imgSrc" | "rank">> = ({
  title,
  artist,
  stdate,
  eddate,
  time,
  hall,
  price,
}) => {
  return (
    <div className={styles.info}>
      <PerformanceAlbumMeta
        title={title}
        artist={artist}
        stdate={stdate}
        eddate={eddate}
        time={time}
        hall={hall}
      />
      <div className={styles.info__price}>
        <span className={styles.price}>{price}</span>
        <span className={styles.prefix}>부터</span>
      </div>
    </div>
  );
};

interface HomePerformanceRankingItemProps {
  data: PerformanceDataSimple;
}

const HomePerformanceRankingItem: React.FC<HomePerformanceRankingItemProps> = ({
  data,
}) => {
  return (
    <li className={styles.rankingItem}>
      <Card imgSrc={data.imgSrc} rank={data.rank} />
      <Info
        title={data.title}
        artist={data.artist}
        stdate={data.stdate}
        eddate={data.eddate}
        time={data.time}
        hall={data.hall}
        price={data.price}
      />
    </li>
  );
};

export default HomePerformanceRankingItem;
