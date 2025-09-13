import React from 'react';
import styles from "./PerformanceGrid.module.scss";
import PerformanceItem from '../common/PerformanceItem';

const PerformanceGrid: React.FC = () => {
  return (
    <div className={styles["performance-grid"]}>
      <PerformanceItem />
      <PerformanceItem />
      <PerformanceItem />
      <PerformanceItem />
      <PerformanceItem />
      <PerformanceItem />
      <PerformanceItem />
      <PerformanceItem />
      <PerformanceItem />
    </div>
  );
};

export default PerformanceGrid;