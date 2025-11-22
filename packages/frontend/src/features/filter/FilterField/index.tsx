import React, {useState} from "react";
import styles from "./FilterField.module.scss";
import arrowIcon from "@shared/assets/icons/bottom-arrow-gray.svg";
import locationIcon from "@shared/assets/icons/location-red.svg";
import moneyIcon from "@shared/assets/icons/dollar-red.svg";

interface FilterFieldProps {
  label: string;
}

const iconObj: Record<string, string> = {
  지역: locationIcon,
  가격: moneyIcon,
};

const FilterField: React.FC<FilterFieldProps> = ({ label }) => {
  const [value, setValue] = useState("전체");
  return (
    <div className={styles.filter__field}>
      <div className={styles.fieldLabel}>
        <img className={styles.fieldLabel__icon} src={iconObj[`${label}`]} alt="" />
        {label}
      </div>
      <div className={styles.fieldContent}>
        <span className={styles.fieldContent__value}>{value}</span>
        <img className={styles.fieldContent__arrowIcon} src={arrowIcon} alt="" />
      </div>
    </div>
  );
};

export default FilterField;
