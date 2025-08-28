import React from "react";
import styles from "./DetailTopComp.module.scss";

interface DetailTopCompProps {
  title: string;
  children: React.ReactNode;
}

const DetailTopComp: React.FC<DetailTopCompProps> = ({ title, children }) => {
  return (
    <div className={styles["info__comp"]}>
      <span className={styles["info__comp-title"]}>{title}</span>
      {children}
    </div>
  );
};

export default DetailTopComp;
