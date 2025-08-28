import React from "react";
import styles from "./SeatInfo.module.scss";

interface DetailSeatInfoProps {
  data: string;
}

const DetailSeatInfo: React.FC<DetailSeatInfoProps> = ({
  data,
}) => {
  const [seatType, price] = data.split(/ +/);
  return (
    <div className={styles["seat"]}>
      <span className={styles["seat__type"]}>{seatType}</span>
      <span className={styles["seat__price"]}>{price}</span>
    </div>
  );
};

export default DetailSeatInfo;
