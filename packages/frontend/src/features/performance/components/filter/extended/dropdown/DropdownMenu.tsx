import React, { type SetStateAction } from "react";
import styles from "./DropdownMenu.module.scss";
import type { fieldContentType, fieldType } from "../../../Header";

const DropdownMenu: React.FC<{
  main: string;
  sub?: string;
  fieldType: fieldType;
  onSelect: (menu: string) => void;
  onFieldSelect: React.Dispatch<SetStateAction<fieldType | "">>;
  setFieldContent: React.Dispatch<SetStateAction<fieldContentType>>;
}> = ({ main, sub, onSelect, onFieldSelect, setFieldContent}) => {
  return (
    <div
      className={styles["dropdown-menu"]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(main);
        onFieldSelect("");
        setFieldContent(prev => ({...prev, fieldType: main}));
      }}
    >
      <div className={styles["dropdown-menu-wrapper"]}>
        <div className={styles["dropdown-menu__main"]}>{main}</div>
        <div className={styles["dropdown-menu__sub"]}>{sub}</div>
      </div>
    </div>
  );
};

export default DropdownMenu;
