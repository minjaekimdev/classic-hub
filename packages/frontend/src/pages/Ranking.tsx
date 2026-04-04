import type { Period } from "@classic-hub/shared/types/client";
import { useState } from "react";
import RankingHeader from "@/widgets/ranking/RankingHeader";
import RankList from "@/widgets/ranking/RankList";
import LayoutDesktop from "@/layout/desktop/LayoutDesktop";
import { ModalProvider } from "@/app/providers/modal/ModalProvider";
import useBreakpoint from "@/shared/hooks/useBreakpoint";
import { BREAKPOINTS } from "@/shared/constants";

const LayoutSwitcher = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useBreakpoint(BREAKPOINTS.MOBILE);

  if (!isMobile) {
    return (
      <LayoutDesktop variant="main">
        <LayoutDesktop.Wrapper hasPaddingTop={true}>
          <div className="flex items-start">
            <div className="flex-1">{children}</div>
          </div>
        </LayoutDesktop.Wrapper>
      </LayoutDesktop>
    );
  } else {
    return <div className="pt-8">{children}</div>;
  }
};

const Ranking = () => {
  const [period, setPeriod] = useState<Period>("daily");

  const handlePeriod = (period: Period) => {
    setPeriod(period);
  };

  return (
    <ModalProvider>
      <LayoutSwitcher>
        <div className="flex flex-col gap-[2.19rem] px-4">
          <RankingHeader period={period} onToggle={handlePeriod} />
          <RankList period={period} />
        </div>
      </LayoutSwitcher>
    </ModalProvider>
  );
};

export default Ranking;
