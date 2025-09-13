import React from "react";
import styles from "./Pagenation.module.scss";
import PageCount from "./PageCount";
import PageMove from "./PageMove";

const Pagenation: React.FC = () => {
  return (
    <div className={styles["pagenation"]}>
      <PageMove />
      <PageCount />
    </div>
  );
};

export default Pagenation;
