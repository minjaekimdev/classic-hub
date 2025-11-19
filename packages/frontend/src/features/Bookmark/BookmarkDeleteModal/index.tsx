import React from "react";
import styles from "./BookmarkDeleteModal.module.scss";
import Modal from "@/shared/ui/Modal";
import alertIcon from "@shared/assets/icons/alert.svg";

const ButtonGroup = () => {
  return (
    <div className={styles.buttonGroup}>
      <button className={styles.cancel}>취소</button>
      <button className={styles.delete}>삭제</button>
    </div>
  );
};

interface BookmarkDeleteModalProps {
  title: string;
}

const BookmarkDeleteModal: React.FC<BookmarkDeleteModalProps> = ({title}) => {
  return (
    <Modal>
      <div className={styles.bookmarkDeleteModal}>
        <div className={styles.bookmarkDeleteModal__header}>
          <img className={styles.alertIcon} src={alertIcon} alt="" />
          <h3 className={styles.headerText}>찜 목록에서 삭제하시겠습니까?</h3>
        </div>
        <p className={styles.bookmarkDeleteModal__text}>
          <span className={styles.bookmarkDeleteModal__pfTitle}>"{title}"</span>
          <span className={styles.bookmarkDeleteModal__message}>을(를) 찜한 공연 목록에서 삭제합니다.</span>
        </p>
        <ButtonGroup />
      </div>
    </Modal>
  );
};

export default BookmarkDeleteModal;
