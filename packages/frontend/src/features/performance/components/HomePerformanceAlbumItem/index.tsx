import React from "react";
import styles from "./HomePerformanceAlbumItem.module.scss";
import CardBadge from "@/shared/ui/CardBadge";
import Bookmark from "@/shared/ui/buttons/BookmarkButton";
import type { PerformanceDataSimple } from "@/shared/model/performance.front";
import PerformanceAlbumMeta from "../PerformanceMeta";

interface CardProps {
  imgSrc: string;
  rank?: string;
}

const Card: React.FC<CardProps> = ({ imgSrc, rank }) => {
  return (
    <div className={styles.card}>
      <img className={styles.card__poster} src={imgSrc} alt="" />
      {rank && (
        <CardBadge style={{ top: "0.66rem", left: "0.66rem" }}>
          {rank}위
        </CardBadge>
      )}
      <Bookmark style={{ top: "0.66rem", right: "0.66rem" }} />
    </div>
  );
};

const Info: React.FC<Omit<PerformanceDataSimple, "imgSrc">> = ({
  title,
  artist,
  stdate,
  eddate,
  time,
  hall,
  lowPrice,
  highPrice,
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
        {lowPrice === highPrice ? (
          <>
            <span className={styles.price}>전석 {lowPrice}</span>
          </>
        ) : (
          <>
            <span className={styles.price}>{lowPrice}</span>
            <span className={styles.prefix}>부터</span>
          </>
        )}
      </div>
    </div>
  );
};

const DesktopItem: React.FC<{ data: PerformanceDataSimple }> = ({ data }) => {
  return (
    <li className={styles.desktopItem}>
      <Card imgSrc={data.imgSrc} rank={data.rank} />
      <Info
        title={data.title}
        artist={data.artist}
        stdate={data.stdate}
        eddate={data.eddate}
        time={data.time}
        hall={data.hall}
        lowPrice={data.lowPrice}
        highPrice={data.highPrice}
      />
    </li>
  );
};

export default DesktopItem;
