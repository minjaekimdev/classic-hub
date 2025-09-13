import React, { useState } from "react";
import styles from "./SortBar.module.scss";
import dropdownArrow from "@assets/dropdown/dropdown-icon-gray.svg";
import DropdownMenu from "./DropdownMenu";

const SortBar: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [value, setValue] = useState("공연임박순");

  return (
    <div className={styles["sort-bar"]}>
      <div
        className={styles["sort-dropdown-trigger"]}
        onClick={(e) => {
          e.stopPropagation();
          setShowDropdown((prev) => !prev);
        }}
      >
        <span className={styles["text"]}>{value}</span>
        <img src={dropdownArrow} alt="" />
        {showDropdown && (
          <DropdownMenu value={value} setValue={setValue} setShowDropdown={setShowDropdown}/>
        )}
      </div>
      <div className={styles["count"]}>
        <span className={styles["count__now"]}>1-20</span>
        <span> / </span>
        <span className={styles["count__all"]}>127개 공연</span>
      </div>
    </div>
  );
};

export default SortBar;
