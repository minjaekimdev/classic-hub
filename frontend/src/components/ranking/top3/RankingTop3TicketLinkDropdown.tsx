import React from "react";
import type { TicketLink } from "@/models/common.client";
import styles from "./RankingTop3TicketLinkDropdown.module.scss";
import interparkIcon from "@assets/ticketlink/interpark-logo.png";
import yes24Icon from "@assets/ticketlink/yes24-logo.png";
import ticketlinkIcon from "@assets/ticketlink/ticketlink-logo.png";
import melonticketIcon from "@assets/ticketlink/melonticket-logo.png";
import linkIcon from "@assets/ticketlink/ticketlink-icon-gray.svg";

interface RankingTop3TicketLinkDropdownProps {
  data: TicketLink;
}

const ticketlinkIconMap: Record<string, string> = {
  인터파크: `url(${interparkIcon})`,
  예스24: `url(${yes24Icon})`,
  티켓링크: `url(${ticketlinkIcon})`,
  멜론티켓: `url(${melonticketIcon})`,
};

const RankingTop3TicketLinkDropdown: React.FC<
  RankingTop3TicketLinkDropdownProps
> = ({ data }) => {
  return (
    <a className={styles["ticketlink-link"]} href={data.relateurl._text}>
      <div className={styles["ticketlink-item"]}>
        <div className={styles["ticketlink-item__wrapper"]}>
          <div
            className={styles["icon"]}
            style={{
              backgroundImage: ticketlinkIconMap[data.relatenm._text],
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <span className={styles["ticketlink-name-initial"]}>
              {!(data.relatenm._text in ticketlinkIconMap) && data.relatenm._text[0]}
            </span>
          </div>
          <div className={styles["name"]}>
            <span className={styles["name__main"]}>{data.relatenm._text}</span>
            <span className={styles["name__sub"]}>예매 바로가기</span>
          </div>
        </div>
        <img src={linkIcon} alt="" />
      </div>
    </a>
  );
};

export default RankingTop3TicketLinkDropdown;
