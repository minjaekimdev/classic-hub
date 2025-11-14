import "@app/styles/main.scss";
import React from "react";
import styles from "./PerformanceCardAlbumText.module.scss";
import calendarIcon from "@shared/assets/icons/calendar-gray.svg";
import clockIcon from "@shared/assets/icons/clock-gray.svg";
import locationIcon from "@shared/assets/icons/location-gray.svg";

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
    <div className={styles.performanceCardText}>
      <ul className={styles.performanceCardText__identity}>
        <li className={styles.performanceCardText__title}>
          {title}
        </li>
        <li className={styles.performanceCardText__artist}>{artist}</li>
      </ul>
      <ul className={styles.performanceCardText__meta}>
        <li className={styles.performanceCardText__metaItem}>
          <img className={styles.performanceCardText__icon} src={calendarIcon}></img>
          <span className={styles.performanceCardText__text}>{date}</span>
        </li>
        <li className={styles.performanceCardText__metaItem}>
          <img className={styles.performanceCardText__icon} src={clockIcon}>{}</img>
          <span className={styles.performanceCardText__text}>{time}</span>
        </li>
        <li className={styles.performanceCardText__metaItem}>
          <img className={styles.performanceCardText__icon} src={locationIcon}>{}</img>
          <span className={styles.performanceCardText__text}>{location}</span>
        </li>
      </ul>
    </div>
  );
};

export default PerformanceCardText;
