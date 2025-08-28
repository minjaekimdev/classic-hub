import React from "react";
import styles from "./Ticketlink.module.scss";
import linkImage from "@assets/ticketlink/ticketlink-icon-black.svg";
import type { TicketLink } from "@/models/common.client";

interface ConcertDetailTicketlinkProps {
  data: TicketLink;
}

const DetailTicketlink: React.FC<ConcertDetailTicketlinkProps> = ({
  data,
}) => {
  const { relatenm, relateurl } = data;
  return (
    <div className={styles["ticketlink"]}>
      <span className={styles["ticketlink__name"]}>{relatenm._text}</span>
      <a href={`${relateurl._text}`}>
        <button className={styles["ticketlink__button"]}>
          <span className={styles["link-text"]}>바로가기</span>
          <img className={styles["link-icon"]} src={linkImage} alt="" />
        </button>
      </a>
    </div>
  );
};

export default DetailTicketlink;
