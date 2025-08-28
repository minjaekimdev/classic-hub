import React, { useState, useEffect } from "react";
import RankingHeader from "./RankingHeader";
import RankingTop3 from "./top3/RankingTop3";
import RankingTable from "./table/RankingTable";
import type { RankingPeriod, RankingItem } from "@/models/ranking.client";

export interface RankingDataByPeriod {
  daily: RankingItem[];
  weekly: RankingItem[];
  monthly: RankingItem[];
}

const RankingContainer: React.FC = () => {
  const [period, setPeriod] = useState<RankingPeriod>("daily");
  const [rankingData, setRankingData] = useState<RankingDataByPeriod>({
    daily: [],
    weekly: [],
    monthly: [],
  });

  useEffect(() => {
    async function fetchAllRankingData() {
      try {
        const [dailyRankingData, weeklyRankingData, monthlyRankingData] =
          await Promise.all([
            fetch("http://localhost:3000/ranking/daily").then((res) =>
              res.json()
            ),
            fetch("http://localhost:3000/ranking/weekly").then((res) =>
              res.json()
            ),
            fetch("http://localhost:3000/ranking/monthly").then((res) =>
              res.json()
            ),
          ]);

        setRankingData({
          daily: dailyRankingData,
          weekly: weeklyRankingData,
          monthly: monthlyRankingData,
        });
      } catch (error) {
        console.log("랭킹 데이터 불러오기 실패", error);
      }
    }

    fetchAllRankingData();
  }, []);

  const currentRankingData = rankingData[period];

  return (
    <div className="ranking-background" style={{ background: "#f9fafb" }}>
      <div className="container">
        <RankingHeader onPeriodChange={setPeriod} period={period} />
        <RankingTop3 data={currentRankingData.slice(0, 3)} />
        <RankingTable data={currentRankingData.slice(3, 50)} />
      </div>
    </div>
  );
};

export default RankingContainer;
