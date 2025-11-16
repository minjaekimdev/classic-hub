import React, { type CSSProperties } from "react";
import "@app/styles/main.scss";
import styles from "./ProgramButton.module.scss";
import noteIcon from "@shared/assets/icons/musical-note-red.svg";

interface ProgramButtonProps {
  style?: CSSProperties;
}

const ProgramButton: React.FC<ProgramButtonProps> = ({ style }) => {
  return (
    <button className={styles.programButton} style={style}>
      <img src={noteIcon} alt="" />
      프로그램 보기
    </button>
  );
};

export default ProgramButton;
