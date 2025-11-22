import "@app/styles/main.scss";
import React from "react";
import styles from "./FilterSmall.module.scss";
import searchIcon from "@assets/filter/search-icon.svg";
import FilterSmallItem from "./FilterSmallItem";
import type { fieldType } from "../../Header";

const FilterSmall: React.FC<{
  selected: string | null;
  onFieldClick: (field: fieldType) => void;
}> = ({ selected, onFieldClick }) => {
  return (
    <div className={styles["filter-small"]}>
      <FilterSmallItem
        field="검색어"
        selected={selected}
        onSelect={onFieldClick}
      />
      <FilterSmallItem
        field="지역"
        selected={selected}
        onSelect={onFieldClick}
      />
      <FilterSmallItem
        field="가격"
        selected={selected}
        onSelect={onFieldClick}
      />
      <FilterSmallItem
        field="기간"
        selected={selected}
        onSelect={onFieldClick}
      />
      <div className={styles["search-button"]}>
        <img className={styles["search-icon"]} src={searchIcon} alt="" />
      </div>
    </div>
  );
};

export default FilterSmall;
