import React from "react";
import styles from "./FilterSearchField.module.scss";
import searchIcon from "@shared/assets/icons/search-red.svg";

const FilterSearchField = () => {
  return (
    <div className={styles.filter__searchField}>
      <div className={styles.fieldLabel}>
        <img className={styles.fieldLabel__icon} src={searchIcon} alt="" />
        검색어
      </div>
      <div className={styles.fieldContent}>
        <input
          className={styles.fieldContent__input}
          type="text"
          placeholder="공연명, 아티스트명, 작품명 등으로 검색해보세요!"
        />
      </div>
    </div>
  );
};

export default FilterSearchField;
