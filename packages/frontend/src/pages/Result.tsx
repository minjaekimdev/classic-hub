import Modal from "@/shared/ui/modal/Modal";
import useBreakpoint from "@/shared/hooks/useBreakpoint";
import { Toaster } from "sonner";
import BookingModal from "@/features/booking/BookingModal";
import { BREAKPOINTS } from "@/shared/constants";
import MainLayoutMobile from "@/layout/mobile/MainLayoutMobile";
import LayoutDesktop from "@/layout/desktop/LayoutDesktop";
import FeedbackModal from "@/features/feedback/FeedbackModal";
import PerformanceSection from "@/widgets/result/PerformanceSection";
import FilterDesktop from "@/features/filter/ui/desktop/FilterDesktop";
import ResultHeader from "@/widgets/result/ResultHeader";
import { ResultContext } from "@/features/performance/contexts/result-context";
import { FilterProvider } from "@/features/filter/contexts/filter-context";
import useResultPerformances from "@/features/filter/hooks/useResultPerformances";

const LayoutSwitcher = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useBreakpoint(BREAKPOINTS.TABLET);

  if (!isMobile) {
    return (
      <LayoutDesktop variant="main">
        <LayoutDesktop.Wrapper hasPaddingTop={false}>
          <div className="flex items-start">
            <div className="flex-1">
              <ResultHeader />
              {children}
            </div>
            <FilterDesktop />
          </div>
        </LayoutDesktop.Wrapper>
      </LayoutDesktop>
    );
  } else {
    return <MainLayoutMobile>{children}</MainLayoutMobile>;
  }
};

const Result = () => {
  const { allPerformances, filteredPerformances } = useResultPerformances();

  return (
    <ResultContext.Provider value={{ allPerformances, filteredPerformances }}>
      <Toaster />
      <Modal>
        <BookingModal />
        <FeedbackModal />
        <Toaster />
        <FilterProvider>
          <LayoutSwitcher>
            <PerformanceSection />
          </LayoutSwitcher>
        </FilterProvider>
      </Modal>
    </ResultContext.Provider>
  );
};

export default Result;
