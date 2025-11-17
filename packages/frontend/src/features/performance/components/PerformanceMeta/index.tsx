import React from "react";
import type { PerformanceDataSimple } from "@root-shared/model/performance.front";
import "@app/styles/main.scss";
import styles from "./PerformanceMeta.module.scss";
import calendarIcon from "@shared/assets/icons/calendar-gray.svg";
import clockIcon from "@shared/assets/icons/clock-gray.svg";
import locationIcon from "@shared/assets/icons/location-gray.svg";

const MetaItemDate: React.FC<{ stdate: string; eddate: string }> = ({
  stdate,
  eddate,
}) => {
  return (
    <li className={styles.metaItem}>
      <img src={calendarIcon} alt="" />
      <div className={styles.metaItem__date}>
        <span className={styles.metaItem__text}>{stdate}</span>
        {stdate !== eddate && (
          <>
            <br />~ <span className={styles.metaItem__text}>{eddate}</span>
          </>
        )}
      </div>
    </li>
  );
};

const MetaItem: React.FC<{ iconSrc: string; label: string }> = ({
  iconSrc,
  label,
}) => {
  return (
    <li className={styles.metaItem}>
      <img src={iconSrc} alt="" />
      {label}
    </li>
  );
};

const PerformanceMeta: React.FC<
  Omit<PerformanceDataSimple, "imgSrc" | "rank" | "lowPrice" | "highPrice">
> = ({ title, artist, stdate, eddate, time, hall }) => {
  return (
    <div className={styles.meta}>
      <div className={styles.meta__main}>
        <p className={styles.meta__title}>{title}</p>
        <p className={styles.meta__artist}>{artist}</p>
      </div>
      <div className={styles.meta__list}>
        <ul className={styles["meta__list-wrapper"]}>
          <MetaItemDate stdate={stdate} eddate={eddate} />
          <MetaItem iconSrc={clockIcon} label={time} />
          <MetaItem iconSrc={locationIcon} label={hall} />
        </ul>
      </div>
    </div>
  );
};

export default PerformanceMeta;
