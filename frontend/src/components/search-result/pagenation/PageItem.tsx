import React from 'react';
import styles from "./PageItem.module.scss";

const PageItem: React.FC<{children?: React.ReactNode}> = ({children}) => {
  return (
    <div className={styles["page-item"]}>
      {children}
    </div>
  );
};

export default PageItem;