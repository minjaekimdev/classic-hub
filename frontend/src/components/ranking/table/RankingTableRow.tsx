import React from "react";
import styles from "./RankingTableRow.module.scss";
import type { RankingItem } from "@/models/ranking.client";
import RankingTableTicketLink from "./RankingTableTicketLink";
import { Link } from "react-router-dom";

interface RankingTableRowProps {
  data: RankingItem;
}

const RankingTableRow: React.FC<RankingTableRowProps> = ({ data }) => {
  const { mt20id, rnum, poster, prfnm, prfplcnm, prfpd, relates } = data;
  return (
    <Link to={`/detail/${mt20id._text}`}>
      <div className={styles["table-row"]}>
        <div
          className={`${styles["table-row__cell"]} ${styles["table-row__rank"]}`}
        >
          {rnum._text}
        </div>
        <div
          className={`${styles["table-row__cell"]} ${styles["table-row__title"]}`}
        >
          <figure
            className={styles.poster}
            style={{
              backgroundImage: `url("${poster._text}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></figure>
          <p className={styles.pfnm}>{prfnm._text}</p>
        </div>
        <div
          className={`${styles["table-row__cell"]} ${styles["table-row__venue"]}`}
        >
          {prfplcnm._text}
        </div>
        <div
          className={`${styles["table-row__cell"]} ${styles["table-row__period"]}`}
        >
          {prfpd._text}
        </div>
        <div
          className={`${styles["table-row__cell"]} ${styles["table-row__booking"]}`}
        >
          <RankingTableTicketLink data={relates.relate} />
        </div>
      </div>
    </Link>
  );
};

export default RankingTableRow;
