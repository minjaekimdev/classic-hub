import useBreakpoint from "@/shared/hooks/useBreakpoint";
import { Toaster } from "sonner";
import { BREAKPOINTS } from "@/shared/constants";
import MainLayoutMobile from "@/layout/mobile/MainLayoutMobile";
import LayoutDesktop from "@/layout/desktop/LayoutDesktop";
import PerformanceSection from "@/widgets/result/ui/PerformanceSection";
import FilterDesktop from "@/features/filter/ui/desktop/FilterDesktop";
import ResultHeader from "@/widgets/result/ui/ResultHeader";
import { ResultContext } from "@/features/performance/contexts/result-context";
import { FilterProvider } from "@/features/filter/contexts/filter-context";
import { useSearchParams } from "react-router-dom";
import useResultPerformances from "@/features/performance/api/hooks/useResultPerformances";
import { ModalProvider } from "@/app/providers/modal/ModalProvider";
import type { QueryParams } from "@/features/filter/types/filter";
import { BottomSheetProvider } from "@/app/providers/bottom-sheet/BottomSheetProvider";
import SearchMobile from "@/features/filter/contexts/search-context.mobile";

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
      <SearchMobile>
        <BottomSheetProvider>
          <MainLayoutMobile>{children}</MainLayoutMobile>
        </BottomSheetProvider>
      </SearchMobile>
    );
  }
};

const Result = () => {
  const [searchParams] = useSearchParams();
  const searchParamsObj = Object.fromEntries(
    searchParams,
  ) as unknown as QueryParams;

  // 최상위 컴포넌트에서는 url 상태를 바탕으로 선택된 기준에 해당되는 전체 공연을 가져오기
  const {
    data: allPerformances,
    isLoading,
    isError,
    refetch,
  } = useResultPerformances(searchParamsObj as unknown as QueryParams);

  return (
    <ModalProvider>
      <ResultContext.Provider
        value={{
          allPerformances,
          isLoading,
          isError,
          keyword: searchParamsObj.keyword,
          refetch,
        }}
      >
        <Toaster />
        <FilterProvider>
          <LayoutSwitcher>
            <PerformanceSection />
          </LayoutSwitcher>
        </FilterProvider>
      </ResultContext.Provider>
    </ModalProvider>
  );
};

export default Result;
