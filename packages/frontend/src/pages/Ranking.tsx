import RankingHeader from "@/features/ranking/components/RankingHeader";
import RankingList from "@/features/ranking/components/RankingList";
import useRankingPerformance from "@/features/ranking/hooks/useRankingPerformance";
import Modal from "@/shared/ui/modals/Modal";
import MainLayout from "@/shared/layout/MainLayout";
import type { Period } from "@classic-hub/shared/types/client";
import { useState } from "react";
import BookingModal from "@/shared/ui/modals/BookingModal";

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
        <BookingModal></BookingModal>
        <div className="flex flex-col gap-[2.19rem]">
          <RankingHeader period={period} onToggle={handlePeriod} />
          <RankingList period={period} data={rankingDataObj[period]} />
        </div>
      </Modal>
    </MainLayout>
  );
};

export default Ranking;
