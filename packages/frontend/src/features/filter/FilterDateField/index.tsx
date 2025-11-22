import React, { useState } from "react";
import styles from "./FilterDateField.module.scss";
import labelCalendarIcon from "@shared/assets/icons/calendar-red.svg";
import valueCalendarIcon from "@shared/assets/icons/calendar-black.svg";

const FilterDateField = () => {
  const [value, setValue] = useState("날짜 선택");
  return (
    <div className={styles.filter__dateField}>
      <div className={styles.fieldLabel}>
        <img
          className={styles.fieldLabel__icon}
          src={labelCalendarIcon}
          alt=""
        />
        날짜
      </div>
      <div className={styles.fieldContent}>
        <img src={valueCalendarIcon} alt="" />
        <span className={styles.fieldContent__value}>{value}</span>
      </div>
    </div>
  );
};

export default FilterDateField;
