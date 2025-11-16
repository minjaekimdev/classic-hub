import React, { useState, type CSSProperties } from "react";
import "@app/styles/main.scss";
import styles from "./BookmarkButton.module.scss";
import heartIconActive from "@shared/assets/icons/heart-red.svg";
import heartIconInactive from "@shared/assets/icons/heart-gray.svg";

interface BookmarkProp {
  style: CSSProperties;
}

const BookmarkButton: React.FC<BookmarkProp> = ({ style }) => {
  const [isActive, setIsActive] = useState(false);
  return (
    <button
      className={styles.bookmark}
      style={style}
      onClick={() => setIsActive((prev) => !prev)}
    >
      {isActive ? (
        <img src={heartIconActive} />
      ) : (
        <img src={heartIconInactive} />
      )}
    </button>
  );
};

export default BookmarkButton;
