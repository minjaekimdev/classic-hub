import React from "react";
import styles from "./RankingTop3Card.module.scss";
import type { RankingItem } from "@/models/ranking.client";
import rankingFirst from "@assets/ranking/ranking-first.svg";
import rankingSecond from "@assets/ranking/ranking-second.svg";
import rankingThird from "@assets/ranking/ranking-third.svg";
import locationIcon from "@assets/card/performance-item-location-icon.svg";
import periodIcon from "@assets/card/performance-item-period-icon.svg";
import RankingTop3TicketLink from "./RankingTop3TicketLink";
import { Link } from "react-router-dom";

const rankingIconArray = [rankingFirst, rankingSecond, rankingThird];
const rankNumStyleArray = [
  styles["rank--first"],
  styles["rank--second"],
  styles["rank--third"],
];

interface RankingTop3CardProps {
  data: RankingItem;
  index: number;
}

const RankingTop3Card: React.FC<RankingTop3CardProps> = ({ data, index }) => {
  const { mt20id, rnum, poster, prfnm, prfplcnm, prfpd, relates } = data;
  const ticketlinkData = relates.relate;

  return (
    <li key={mt20id._text} className={styles["top3-card"]}>
      <Link to={`/detail/${mt20id._text}`}>
        <figure
          className={styles["top3-card__poster"]}
          style={{
            backgroundImage: `url(${poster._text})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className={`${styles["rank"]} ${rankNumStyleArray[index]}`}>
            <img src={rankingIconArray[index]} alt="" />
            <span className={styles["rank__text"]}>{`${rnum._text}위`}</span>
          </div>
        </figure>
      </Link>
      <div className={styles["top3-info"]}>
        <div className={styles["top3-info__container"]}>
          <Link to={`/detail/${mt20id._text}`}>
            <h3 className={styles["top3-info__title"]}>{prfnm._text}</h3>
          </Link>
          <p className={styles["top3-info__location"]}>
            <img
              src={locationIcon}
              alt=""
              className={styles["top3-info__location-icon"]}
            />
            <span className={styles["place"]}>{prfplcnm._text}</span>
          </p>
          <p className={styles["top3-info__period"]}>
            <img
              src={periodIcon}
              alt=""
              className={styles["top3-info__period-icon"]}
            />
            <span className={styles["period"]}>{prfpd._text}</span>
          </p>
        </div>
        <RankingTop3TicketLink data={ticketlinkData} />
      </div>
    </li>
  );
};

export default RankingTop3Card;
