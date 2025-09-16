import React from "react";
import styles from "./PerformanceCardGallery.module.scss";
import PerformanceCard from "@/components/common/PerformanceItem";

const PerformanceCardGallery: React.FC = () => {
  return (
    <div className={styles["performance-card-gallery"]}>
      <PerformanceCard />
      <PerformanceCard />
      <PerformanceCard />
      <PerformanceCard />
      <PerformanceCard />
    </div>
  );
};

export default PerformanceCardGallery;
