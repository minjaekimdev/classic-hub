import Modal from "@/shared/ui/modals/Modal";
import MainLayout from "@/layout/shared/MainLayout";
import type { Period } from "@classic-hub/shared/types/client";
import { useState } from "react";
import BookingModal from "@/shared/ui/modals/BookingModal";
import useRankingPerformance from "@/features/performance/api/hooks/use-ranking-performance";
import RankingHeader from "@/widgets/ranking/RankingHeader";
import RankList from "@/widgets/ranking/RankList";

const Ranking = () => {
  const [period, setPeriod] = useState<Period>("daily");

  const handlePeriod = (period: Period) => {
    setPeriod(period);
  };

  const rankingDataObj = {
    daily: useRankingPerformance("daily"),
    weekly: useRankingPerformance("weekly"),
    monthly: useRankingPerformance("monthly"),
  };

  return (
    <MainLayout>
      <Modal>
        <BookingModal />
        <div className="flex flex-col gap-[2.19rem]">
          <RankingHeader period={period} onToggle={handlePeriod} />
          <RankList period={period} data={rankingDataObj[period]} />
        </div>
      </Modal>
    </MainLayout>
  );
};

export default Ranking;
