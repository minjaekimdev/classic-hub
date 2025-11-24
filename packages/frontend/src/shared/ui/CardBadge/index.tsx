import React, { type CSSProperties } from "react";
import styles from "./CardBadge.module.scss";

interface CardBadgeProps {
  children: React.ReactNode;
  style?: CSSProperties;
}

const CardBadge: React.FC<CardBadgeProps> = ({ children, style }) => {
  return (
    <div className={styles.cardBadge} style={style}>
      {children}
    </div>
  );
};

export default CardBadge;
