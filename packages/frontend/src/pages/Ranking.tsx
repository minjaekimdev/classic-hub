import Modal from "@/shared/ui/modal/Modal";
import type { Period } from "@classic-hub/shared/types/client";
import { useState } from "react";
import RankingHeader from "@/widgets/ranking/RankingHeader";
import RankList from "@/widgets/ranking/RankList";
import BookingModal from "@/features/booking/BookingModal";
import LayoutDesktop from "@/layout/desktop/LayoutDesktop";
import { useRankingPerformances } from "@/features/performance/api/hooks/useRankingPerformances";

const Ranking = () => {
  const [period, setPeriod] = useState<Period>("daily");

  const handlePeriod = (period: Period) => {
    setPeriod(period);
  };

  const rankingDataObj = {
    daily: useRankingPerformances("daily"),
    weekly: useRankingPerformances("weekly"),
    monthly: useRankingPerformances("monthly"),
  };

  return (
    <LayoutDesktop variant="main">
      <Modal>
        <BookingModal />
        <LayoutDesktop.Wrapper hasPaddingTop={true}>
          <div className="flex flex-col gap-[2.19rem]">
            <RankingHeader period={period} onToggle={handlePeriod} />
            <RankList period={period} data={rankingDataObj[period]} />
          </div>
        </LayoutDesktop.Wrapper>
      </Modal>
    </LayoutDesktop>
  );
};

export default Ranking;
