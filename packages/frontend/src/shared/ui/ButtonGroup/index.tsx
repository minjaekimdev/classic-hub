import "@app/styles/main.scss";
import React from "react";
import styles from "./ButtonGroup.module.scss";

interface ButtonGroupProps {
  mainText: string;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({ mainText }) => {
  return (
    <div className={styles.buttonGroup}>
      <button className={styles.cancel}>취소</button>
      <button className={styles.delete}>{mainText}</button>
    </div>
  );
};

export default ButtonGroup;
