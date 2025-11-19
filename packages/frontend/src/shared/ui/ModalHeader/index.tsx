import React from 'react';
import styles from "./ModalHeader.module.scss";

interface ModalHeaderProps {
  main: string;
  sub: string;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({main, sub}) => {
  return (
    <div className={styles.modalHeader}>
      <h3 className={styles.modalHeader__main}>{main}</h3>
      <p className={styles.modalHeader__sub}>{sub}</p>
    </div>
  );
};

export default ModalHeader;