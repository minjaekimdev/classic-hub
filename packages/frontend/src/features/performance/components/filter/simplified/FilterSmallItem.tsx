import "@app/styles/main.scss";
import React from "react";
import styles from "./FilterSmallItem.module.scss";
import eraIcon from "@assets/filter/era.svg";
import genreIcon from "@assets/filter/genre.svg";
import locationIcon from "@assets/filter/location.svg";
import moneyIcon from "@assets/filter/money-red.png";
import periodIcon from "@assets/filter/period.svg";
import type { fieldType } from "../../Header";

const FilterSmallItem: React.FC<{
  field: fieldType;
  selected: string | null;
  onSelect: (field: fieldType) => void;
}> = ({ field, onSelect }) => {
  const iconObj = {
    시대: eraIcon,
    장르: genreIcon,
    지역: locationIcon,
    가격: moneyIcon,
    기간: periodIcon,
  };

  return (
    <div
      className={styles["filter-small__item"]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(field);
      }}
    >
      <div className={styles["filter-small__item-wrapper"]}>
        {field !== "검색어" && (
          <img
            className={styles["filter-small__icon"]}
            src={iconObj[field]}
            alt=""
          />
        )}
        <span className={styles["filter-small__text"]}>{field}</span>
      </div>
    </div>
  );
};

export default FilterSmallItem;
