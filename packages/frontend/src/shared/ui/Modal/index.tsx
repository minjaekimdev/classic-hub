import React from "react";
import "@app/styles/main.scss";
import styles from "./Modal.module.scss";

interface ModalProps {
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ children }) => {
  return (
    <div className={styles.modal}>
      <div className={styles.modal__wrapper}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
