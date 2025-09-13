import React from "react";
import styles from "./DropdownMenuItem.module.scss";
import checkIcon from "@assets/dropdown/free-icon-check-mark-1687.png";

const DropdownMenuItem: React.FC<{
  text: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}> = ({ text, value, setValue }) => {
  return (
    <div
      className={styles["dropdown-menu-item"]}
      onClick={() => {
        setValue(text);
      }}
    >
      <span className={styles["dropdown-menu-item__check"]}>
        {value === text && <img className={styles["check-icon"]} src={checkIcon} />}
      </span>
      <span className={styles["dropdown-menu-item__text"]}>{text}</span>
    </div>
  );
};

export default DropdownMenuItem;
