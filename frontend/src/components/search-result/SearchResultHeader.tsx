import React from 'react';
import styles from "./SearchResultHeader.module.scss";

const SearchResultHeader: React.FC = () => {
  return (
    <div className={styles["result-header"]}>
      <p className={styles["title"]}>검색 결과</p>
      <div className={styles["result-count"]}>
        <span className={styles["result-count__number"]}>127</span>
        <span className={styles["result-count__label"]}>개의 공연</span>
      </div>
    </div>
  );
};

export default SearchResultHeader;