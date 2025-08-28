import React from "react";
import styles from "./RankingTable.module.scss";
import RankingTableRow from "./RankingTableRow";
import type { RankingItem } from "@/models/ranking.client";

interface RankingTableProps {
  data: RankingItem[];
}

const RankingTable: React.FC<RankingTableProps> = ({ data }) => {
  return (
    <div className={styles["ranking-table"]}>
      <div className={styles["table-header"]}>
        <div className={styles["table-header__cell"]}>랭킹</div>
        <div className={styles["table-header__cell"]}>공연명</div>
        <div className={styles["table-header__cell"]}>장소</div>
        <div className={styles["table-header__cell"]}>기간</div>
        <div className={styles["table-header__cell"]}>예매하기</div>
      </div>
      <div className="table__body">
        {data.map((element, index) => {
          return <RankingTableRow key={index} data={element} />;
        })}
      </div>
    </div>
  );
};

export default RankingTable;
