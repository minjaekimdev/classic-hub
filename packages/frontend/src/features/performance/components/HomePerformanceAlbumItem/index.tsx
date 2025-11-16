import React from "react";
import "@app/styles/main.scss";
import styles from "./HomePerformanceAlbumItem.module.scss";
import CardBadge from "@/shared/ui/CardBadge";
import Bookmark from "@/shared/ui/BookmarkButton";
import type { PerformanceDataSimple } from "@root-shared/model/performance.front";
import PerformanceAlbumMeta from "../PerformanceAlbumMeta";
import ProgramButton from "@/shared/ui/ProgramButton";

interface CardProps {
  imgSrc: string;
  rank?: string;
}

const MobileCard: React.FC<CardProps> = ({imgSrc}) => {
  return (
    <div className={styles.mobileCard}>
      <img className={styles.mobileCard__poster} src={imgSrc} alt="" />
      <Bookmark style={{ top: "0.66rem", right: "0.66rem" }} />
    </div>
  );
};

const Card: React.FC<CardProps> = ({ imgSrc, rank }) => {
  return (
    <div className={styles.card}>
      <img className={styles.card__poster} src={imgSrc} alt="" />
      <CardBadge style={{ top: "0.66rem", left: "0.66rem" }}>
        {rank}위
      </CardBadge>
      <Bookmark style={{ top: "0.66rem", right: "0.66rem" }} />
      <ProgramButton
        style={{ position: "absolute", bottom: "0.66rem", right: "0.66rem" }}
      />
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
        <span className={styles.price}>{lowPrice}</span>
        <span className={styles.prefix}>부터</span>
      </div>
    </div>
  );
};

interface HomePerformanceAlbumItemProps {
  data: PerformanceDataSimple;
}

const MobileItem: React.FC<HomePerformanceAlbumItemProps> = ({ data }) => {
  return (
    <li className={styles.mobileItem}>
      <MobileCard imgSrc={data.imgSrc} />
      <div className={styles.mobileItem__info}>
        <div className={styles.top}>
          <PerformanceAlbumMeta
            title={data.title}
            artist={data.artist}
            stdate={data.stdate}
            eddate={data.eddate}
            time={data.time}
            hall={data.hall}
          />
          <div>
            <ProgramButton />
          </div>
        </div>
        <p className={styles.mobileItem__price}>
          {data.lowPrice}
          <span> ~ </span>
          {data.highPrice}
        </p>
      </div>
    </li>
  );
};

const DesktopItem: React.FC<HomePerformanceAlbumItemProps> = ({ data }) => {
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
      />
    </li>
  );
};

const HomePerformanceAlbumItem: React.FC<HomePerformanceAlbumItemProps> = ({
  data,
}) => {
  return (
    <>
      <MobileItem data={data} />
      <DesktopItem data={data} />
    </>
  );
};

export default HomePerformanceAlbumItem;
