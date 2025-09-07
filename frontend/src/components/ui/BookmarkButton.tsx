import React from 'react';
import styles from './BookmarkButton.module.scss';
import HeartIcon from '@/assets/bookmark/bookmark-heart.svg';

const BookmarkButton: React.FC = () => {
  return (
    <button className={styles["bookmark-button"]}>
      <img src={HeartIcon} />
    </button>
  );
};

export default BookmarkButton;