import React from 'react';
import styles from "./InfoBadge.module.scss";

const InfoBadge: React.FC = () => {
  return (
    <span className={styles["performance-countdown"]}>
      D-3
    </span>
  );
};

export default InfoBadge;