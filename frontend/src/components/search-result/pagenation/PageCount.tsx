import React from 'react';
import styles from "./PageCount.module.scss";

const PageCount: React.FC = () => {
  return (
    <div className={styles["page-count"]}>
      <span>페이지 </span>
      <span>1</span>
      <span> / </span>
      <span>7</span>
    </div>
  );
};

export default PageCount;