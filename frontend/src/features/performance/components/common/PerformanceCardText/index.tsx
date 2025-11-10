import "@styles/main.scss";
import React from "react";
import styles from "./PerformanceCardText.module.scss";
import calendarIcon from "@shared/assets/icons/calendar.svg";
import clockIcon from "@shared/assets/icons/clock.svg";
import locationIcon from "@shared/assets/icons/location.svg";

interface PerformanceCardTextProps {
  title: string;
  artist: string;
  date: string;
  time: string;
  location: string;
}

const PerformanceCardText: React.FC<PerformanceCardTextProps> = ({
  title,
  artist,
  date,
  time,
  location,
}) => {
  return (
    <div className={styles.performanceCard__text}>
      <ul className={styles.performanceCard__identity}>
        <li className={styles.performanceCard__title}>
          {title}
        </li>
        <li className={styles.performanceCard__artist}>{artist}</li>
      </ul>
      <ul className={styles.performanceCard__meta}>
        <li className={styles.performanceCard__metaItem}>
          <img className={styles.performanceCard__icon} src={calendarIcon}></img>
          <span className={styles.performanceCard__text}>{date}</span>
        </li>
        <li className={styles.performanceCard__metaItem}>
          <img className={styles.performanceCard__icon} src={clockIcon}>{}</img>
          <span className={styles.performanceCard__text}>{time}</span>
        </li>
        <li className={styles.performanceCard__metaItem}>
          <img className={styles.performanceCard__icon} src={locationIcon}>{}</img>
          <span className={styles.performanceCard__text}>{location}</span>
        </li>
      </ul>
    </div>
  );
};

export default PerformanceCardText;
