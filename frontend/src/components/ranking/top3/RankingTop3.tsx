import React from "react";
import type { RankingItem } from "@/models/ranking.client";
import styles from "./RankingTop3.module.scss";
import RankingTop3Card from "./RankingTop3Card";

interface RankingTop3Props {
  data: RankingItem[];
}

const RankingTop3: React.FC<RankingTop3Props> = ({ data }) => {
  return (
    <div className={styles["top3"]}>
      <ul className={styles["top3-container"]}>
        {data.map((element, index) => 
          <RankingTop3Card data={element} index={index} key={index} />
        )}
      </ul>
    </div>
  );
};

export default RankingTop3;
