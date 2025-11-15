import React from "react";
import styles from "./HomePerformanceRankingItem.module.scss";
import CardBadge from "@/shared/ui/CardBadge";
import calendarIcon from "@shared/assets/icons/calendar-gray.svg";
import clockIcon from "@shared/assets/icons/clock-gray.svg";
import locationIcon from "@shared/assets/icons/location-gray.svg";
import type { PerformanceData } from "@root-shared/model/performance.front";

const Card: React.FC<{ imgSrc: string; rank: string }> = ({ imgSrc, rank }) => {
  return (
    <div className={styles.card}>
      <img className={styles.card__poster} src={imgSrc} alt="" />
      <CardBadge>{rank}위</CardBadge>
    </div>
  );
};

const Info: React.FC<Omit<PerformanceData, "imgSrc" | "rank">> = ({
  title,
  artist,
  date,
  time,
  hall,
  price,
}) => {
  return (
    <div className={styles.info}>
      <div className={styles.wrapper}>
        <p className={styles.info__title}>{title}</p>
        <p className={styles.info__artist}>{artist}</p>
        <ul className={styles.meta}>
          <li className={styles.meta__item}>
            <div className={styles["meta__item-wrapper"]}>
              <img src={calendarIcon} alt="" />
              <span className={styles.meta__text}>{date}</span>
            </div>
          </li>
          <li className={styles.meta__item}>
            <div className={styles["meta__item-wrapper"]}>
              <img src={clockIcon} alt="" />
              <span className={styles.meta__text}>{time}</span>
            </div>
          </li>
          <li className={styles.meta__item}>
            <div className={styles["meta__item-wrapper"]}>
              <img src={locationIcon} alt="" />
              <span className={styles.meta__text}>{hall}</span>
            </div>
          </li>
        </ul>
      </div>
      <div className={styles.info__price}>{price}</div>
    </div>
  );
};

const HomePerformanceRankingItem: React.FC<PerformanceData> = ({
  imgSrc,
  rank,
  ...infoData
}) => {
  return (
    <div className={styles.rankingItem}>
      <Card imgSrc={imgSrc} rank={rank} />
      <Info {...infoData} />
    </div>
  );
};

export default HomePerformanceRankingItem;
