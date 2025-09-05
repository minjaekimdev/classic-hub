import React from "react";
import styles from "./DropdownMenu.module.scss";

const DropdownMenu: React.FC<{
  main: string;
  sub?: string;
  onSelect: () => void;
  setSelected: React.Dispatch<React.SetStateAction<number | null>>;
  setFilterActive: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ main, sub, onSelect, setSelected, setFilterActive }) => {
  return (
    <div
      className={styles["dropdown-menu"]}
      onClick={(e) => {
        onSelect();
        setSelected(null);
        setFilterActive(false);
        e.stopPropagation();
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
