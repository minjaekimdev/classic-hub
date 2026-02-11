import { useEffect, useMemo, useState } from "react";
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
import ResultHeader from "@/widgets/result/ResultHeader";
import { fetchSearchResults } from "@/features/performance/api/fetchers/get-performance-result";
import useQueryParams from "@/shared/hooks/useParams";
import { ResultContext } from "@/features/performance/contexts/result-context";
import { FilterProvider } from "@/features/filter/contexts/filter-context";

const LayoutSwitcher = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useBreakpoint(BREAKPOINTS.TABLET);

  if (!isMobile) {
    return (
      <LayoutDesktop variant="main">
        <LayoutDesktop.Wrapper hasPaddingTop={false}>
          <FilterProvider>
            <div className="flex items-start">
              <div className="flex-1">
                <ResultHeader />
                {children}
              </div>
              <FilterDesktop />
            </div>
          </FilterProvider>
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
  const [allPerformances, setAllPerformances] = useState<DetailPerformance[]>(
    [],
  );
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

  useEffect(() => {
    const handler = async () => {
      const performances = await fetchSearchResults({
        keyword,
        location,
        minPrice,
        maxPrice,
        startDate,
        endDate,
      });
      setAllPerformances(performances);
    };

    handler();
  }, [keyword, location, minPrice, maxPrice, startDate, endDate]);

  const filteredPerformances = useMemo(() => {
    const selectedVenueIdSet = new Set(selectedVenues);
    if (selectedVenueIdSet.size === 0) {
      return allPerformances;
    }

    return allPerformances.filter((perf) =>
      selectedVenueIdSet.has(perf.venueId),
    );
  }, [allPerformances, selectedVenues]);

  const sortedPerformances = useMemo(() => {
    if (sortBy === "alphabetical") {
      return [...filteredPerformances].sort((a, b) =>
        a.title.localeCompare(b.title),
      );
    }
    if (sortBy === "price-high") {
      return [...filteredPerformances].sort((a, b) => b.maxPrice - a.maxPrice);
    }
    if (sortBy === "price-low") {
      return [...filteredPerformances].sort((a, b) => a.minPrice - b.minPrice);
    }
    // 기본값은 공연임박순
    return [...filteredPerformances].sort(
      (a, b) =>
        Number(a.endDate.replaceAll(".", "")) -
        Number(b.endDate.replaceAll(".", "")),
    );
  }, [sortBy, filteredPerformances]);

  return (
    <ResultContext.Provider value={{ allPerformances, sortedPerformances }}>
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
