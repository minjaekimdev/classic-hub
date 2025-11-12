import React from "react";
import PerformanceCardText from "../PerformanceCardAlbumText";
import PerformanceCardHomePrice from "../PerformanceCardHomePrice";
import styles from "./PerformanceCardHome.module.scss";

interface PerformanceCardHomeProps {
  imgSrc: string;
  title: string;
  artist: string;
  date: string;
  time: string;
  location: string;
  price: string;
}

const PerformanceCardHome: React.FC<PerformanceCardHomeProps> = ({
  imgSrc,
  title,
  artist,
  date,
  time,
  location,
  price,
}) => {
  return (
    <div className={styles.performanceCardHome}>
      <div className={styles.performanceCardHome__posterWrap}>
        <img
          className={styles.performanceCardHome__poster}
          src={imgSrc}
          alt=""
        />
      </div>
      <div className={styles.performanceCardHome__info}>
        <div className={styles.performanceCardHome__infoWrap}>
          <PerformanceCardText
            title={title}
            artist={artist}
            date={date}
            time={time}
            location={location}
          />
          <PerformanceCardHomePrice price={price} />
        </div>
      </div>
    </div>
  );
};

export default PerformanceCardHome;
