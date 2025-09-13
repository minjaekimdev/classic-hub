import React, { useEffect, useRef } from "react";
import styles from "./DropdownMenu.module.scss";
import DropdownMenuItem from "./DropdownMenuItem";

const DropdownMenu: React.FC<{
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ value, setValue, setShowDropdown }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    }
  }, []);

  return (
    <div ref={dropdownRef} className={styles["dropdown-menu"]}>
      <DropdownMenuItem text="공연임박순" value={value} setValue={setValue} />
      <DropdownMenuItem text="가격낮은순" value={value} setValue={setValue} />
      <DropdownMenuItem text="가격높은순" value={value} setValue={setValue} />
    </div>
  );
};

export default DropdownMenu;
