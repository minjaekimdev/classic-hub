import { useEffect, useState } from "react";
import Modal from "@/shared/ui/modal/Modal";
import useBreakpoint from "@/shared/hooks/useBreakpoint";
import type { DetailPerformance } from "@classic-hub/shared/types/client";
import { Toaster } from "sonner";
import BookingModal from "@/features/booking/BookingModal";
import { BREAKPOINTS } from "@/shared/constants";
import MainLayoutMobile from "@/layout/mobile/MainLayoutMobile";
import LayoutDesktop from "@/layout/desktop/LayoutDesktop";
import FeedbackModal from "@/features/feedback/FeedbackModal";
import PerformanceSection from "@/widgets/result/PerformanceSection";
import FilterDesktop from "@/features/filter/ui/desktop/FilterDesktop";
import FilterMobile from "@/features/filter/ui/mobile/FilterMobile";
import { FilterUIProvider } from "@/features/filter/contexts/FilterUIContext";
import ResultHeader from "@/widgets/result/ResultHeader";
import { fetchSearchResults } from "@/features/performance/api/fetchers/get-performance-result";
import useQueryParams from "@/shared/hooks/useParams";
import { ResultContext } from "@/features/performance/contexts/result-context";

const LayoutSwitcher = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useBreakpoint(BREAKPOINTS.TABLET);

  if (!isMobile) {
    return (
      <LayoutDesktop variant="main">
        <LayoutDesktop.Wrapper hasPaddingTop={false}>
          <FilterUIProvider>
            <div className="flex">
              <div className="flex-1">
                <ResultHeader />
                {children}
              </div>
              <FilterDesktop />
            </div>
          </FilterUIProvider>
        </LayoutDesktop.Wrapper>
      </LayoutDesktop>
    );
  } else {
    return (
      <MainLayoutMobile bottomSheetContent={<FilterMobile />}>
        {children}
      </MainLayoutMobile>
    );
  }
};

const Result = () => {
  const [performances, setPerformances] = useState<DetailPerformance[]>([]);
  const { filters } = useQueryParams();

  useEffect(() => {
    const handler = async () => {
      const performances = await fetchSearchResults(filters);
      setPerformances(performances);
    };

    handler();
  }, [filters]);

  return (
    <ResultContext.Provider value={performances}>
      <Toaster />
      <Modal>
        <BookingModal />
        <FeedbackModal />
        <Toaster />
        <LayoutSwitcher>
          <PerformanceSection />
        </LayoutSwitcher>
      </Modal>
    </ResultContext.Provider>
  );
};

export default Result;
