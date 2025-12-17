import React from "react";
import styles from "./ProgramModal.module.scss";
import noteIcon from "@shared/assets/icons/musical-note-red.svg";
import Modal from "@/features/modal/Modal/Modal";

interface ProgramModalProps {
  title: string;
  artist: string;
  stdate: string;
  eddate: string;
  hall: string;
  program: string;
}

const ProgramModal: React.FC<ProgramModalProps> = ({
  title,
  artist,
  stdate,
  eddate,
  hall,
  program,
}) => {
  return (
    <Modal>
      <div className={styles.programModal}>
        <div className={styles.programModal__header}>
          <img className={styles.noteIcon} src={noteIcon} alt="" />
          <h3 className={styles.headerText}>공연 프로그램</h3>
        </div>
        <ul className={styles.programModal__meta}>
          <li className={styles.title}>{title}</li>
          <li className={styles.artist}>{artist}</li>
          <li className={styles.etc}>
            {stdate === eddate ? (
              stdate
            ) : (
              <>
                {stdate} ~ {eddate}
              </>
            )}
            <span className={styles.pipe}> | </span>
            {hall}
          </li>
        </ul>
        <div className={styles.programModal__program}>
          <pre>{program}</pre>
        </div>
      </div>
    </Modal>
  );
};

export default ProgramModal;
