import React from "react";
import trophyIcon from "@shared/assets/icons/trophy-gold.svg";
import RankingItem from "@/features/ranking/components/RankingItem";
import type { PerformanceType } from "@classic-hub/shared/types/performance";

const RankingListHeader = () => {
  return (
    <div className="">
      <div className="">
        <img src={trophyIcon} alt="트로피 아이콘" />
        <span>월간 인기 공연 Top 50</span>
      </div>
    </div>
  );
};

const RankingList = ({ rankingPerformanceList }) => {
  return (
    <div className="">
      <RankingListHeader />
    </div>
  );
};

export default RankingList;
