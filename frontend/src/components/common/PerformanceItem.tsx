import React from "react";
import styles from "./PerformanceItem.module.scss";
import periodIcon from "@/assets/card/performance-item-period-icon.svg";
import locationIcon from "@/assets/card/performance-item-location-icon.svg";
import BookmarkButton from "../ui/BookmarkButton";
// import InfoBadge from "../ui/InfoBadge";

const PerformanceItem: React.FC = () => {
  return (
    <li className={styles["performance-item"]}>
      <figure className={styles["performance-item__poster"]}>
        <BookmarkButton />
      </figure>
      <div className={styles["performance-item__info"]}>
        <p className={styles["performance-item__title"]}>베토벤 교향곡 9번 '합창'</p>
        <p className={styles["performance-item__location"]}>
          <img
            src={locationIcon}
            alt=""
            className={styles["performance-item__icon"]}
          />
          <span className={styles["performance-item__text"]}>예술의전당 콘서트홀</span>
        </p>
        <p className={styles["performance-item__period"]}>
          <img
            src={periodIcon}
            alt=""
            className={styles["performance-item__icon"]}
          />
          <span className={`${styles["performance-item__text"]} ${styles["performance-item__text--period"]}`}>
            2월 15일 - 17일
          </span>
        </p>
        <p className={styles["performance-item__price"]}>₩80,000~</p>
      </div>
    </li>
  );
};

export default PerformanceItem;
