import React from "react";
import styles from "./PerformanceCardHomePrice.module.scss";

interface PerformanceCardHomePriceProps {
  price: string;
}

const PerformanceCardHomePrice: React.FC<PerformanceCardHomePriceProps> = ({
  price,
}) => {
  return (
    <div className={styles.performanceCardHome__price}>
      <span className={styles.performanceCardHome__priceValue}>{price}원</span>
      <span className={styles.performanceCardHome__priceSuffix}>부터</span>
    </div>
  );
};

export default PerformanceCardHomePrice;
