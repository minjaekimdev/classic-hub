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
import FilterMobile from "@/features/filter/ui/mobile/FilterMobile";
import ResultHeader from "@/widgets/result/ResultHeader";
import useQueryParams from "@/shared/hooks/useParams";
import { ResultContext } from "@/features/performance/contexts/result-context";
import { FilterProvider } from "@/features/filter/contexts/filter-context";
import useResultPerformance from "@/features/performance/api/hooks/useResultPerformance";
import useFilteredPerformances from "@/features/filter/hooks/useFilteredPerformances";
import useSortedPerformances from "@/features/filter/hooks/useSortedPerformances";

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
    return (
      <MainLayoutMobile bottomSheetContent={<FilterMobile />}>
        {children}
      </MainLayoutMobile>
    );
  }
};

const Result = () => {
  const { filters } = useQueryParams();
  const {
    keyword,
    location,
    minPrice,
    maxPrice,
    startDate,
    endDate,
    sortBy,
    selectedVenues,
  } = filters;

  // 1차 필터에 필요한 정보, 2차 필터에 필요한 정보를 따로 나누어 가져온다는 정보만 남기고 추상화하기
  const allPerformances = useResultPerformance({
    keyword,
    location,
    minPrice,
    maxPrice,
    startDate,
    endDate,
});

  // 선택된 공연장들에 해당하는 공연 데이터 필터링하기
  const filteredPerformances = useFilteredPerformances(
    allPerformances,
    selectedVenues,
  );

  // 선택된 정렬 방식에 따라 정렬하기
  const sortedPerformances = useSortedPerformances(
    filteredPerformances,
    sortBy,
  );

  return (
    <ResultContext.Provider value={{ allPerformances, sortedPerformances }}>
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
