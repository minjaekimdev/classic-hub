import type { Period } from "@classic-hub/shared/types/client";
import { useState } from "react";
import RankingHeader from "@/widgets/ranking/RankingHeader";
import RankList from "@/widgets/ranking/RankList";
import LayoutDesktop from "@/layout/desktop/LayoutDesktop";
import { ModalProvider } from "@/app/providers/modal/ModalProvider";
import BottomNavBar from "@/shared/ui/navigation/BottomNavBar";
import useBreakpoint from "@/shared/hooks/useBreakpoint";
import { BREAKPOINTS } from "@/shared/constants";

const Ranking = () => {
  const [period, setPeriod] = useState<Period>("daily");

  const handlePeriod = (period: Period) => {
    setPeriod(period);
  };

  const isMobile = useBreakpoint(BREAKPOINTS.MOBILE);

  return (
    <ModalProvider>
      <LayoutDesktop variant="main">
        <LayoutDesktop.Wrapper hasPaddingTop={true}>
          <div className="flex flex-col gap-[2.19rem] px-4">
            <RankingHeader period={period} onToggle={handlePeriod} />
            <RankList period={period} />
          </div>
        </LayoutDesktop.Wrapper>
      </LayoutDesktop>
      {isMobile && <BottomNavBar />}
    </ModalProvider>
  );
};

export default Ranking;
