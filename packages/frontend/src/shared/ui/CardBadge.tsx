import React from "react";
import style from "./CardBadge.module.scss";

interface CardBadgeProps {
  children: React.ReactNode;
}

const CardBadge: React.FC<CardBadgeProps> = ({ children }) => {
  return <div className={style.CardBadge}>{children}</div>;
};

export default CardBadge;
