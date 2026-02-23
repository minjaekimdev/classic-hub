import Modal from "@/shared/ui/modal/Modal";
import useBreakpoint from "@/shared/hooks/useBreakpoint";
import { Toaster } from "sonner";
import BookingModal from "@/features/booking/BookingModal";
import { BREAKPOINTS } from "@/shared/constants";
import MainLayoutMobile from "@/layout/mobile/MainLayoutMobile";
import LayoutDesktop from "@/layout/desktop/LayoutDesktop";
import FeedbackModal from "@/features/feedback/FeedbackModal";
import PerformanceSection from "@/widgets/result/ui/PerformanceSection";
import FilterDesktop from "@/features/filter/ui/desktop/FilterDesktop";
import ResultHeader from "@/widgets/result/ui/ResultHeader";
import { ResultContext } from "@/features/performance/contexts/result-context";
import { FilterProvider } from "@/features/filter/contexts/filter-context";
import useQueryParams from "@/shared/hooks/useParams";
import useResultPerformances from "@/features/performance/api/hooks/useResultPerformances";
import useFilteredPerformances from "@/features/filter/hooks/useFilteredPerformances";

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
  const { filters } = useQueryParams();
  const { keyword, location, minPrice, maxPrice, startDate, endDate } = filters;

  // 1차 필터에 필요한 정보, 2차 필터에 필요한 정보를 따로 나누어 가져온다는 정보만 남기고 추상화하기
  const {
    data: allPerformances,
    isLoading,
    isError,
    refetch,
  } = useResultPerformances({
    keyword,
    location,
    minPrice,
    maxPrice,
    startDate,
    endDate,
  });

  const filteredPerformances = useFilteredPerformances(
    allPerformances,
    filters,
  );

  return (
    <ResultContext.Provider
      value={{
        allPerformances,
        filteredPerformances,
        isLoading,
        isError,
        refetch,
      }}
    >
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
