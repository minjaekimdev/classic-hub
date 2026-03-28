import { useResult } from "@/features/performance/contexts/result-context";
import ResultPerformanceAlbumCard from "@/features/performance/ui/desktop/ResultPerformanceAlbumCard";
import { PerformanceListCardSkeleton } from "@/features/performance/ui/mobile/PerformanceListSkeleton";
import { BREAKPOINTS } from "@/shared/constants";
import useBreakpoint from "@/shared/hooks/useBreakpoint";
import type { ResultPerformance } from "@classic-hub/shared/types/client";
import useDesktopGridStyle from "../hooks/usePerformancesDesktop";
import ResultPerformanceAlbumCardSkeleton from "@/features/performance/ui/desktop/ResultPerformanceAlbumCardSkeleton";
import EmptyState from "@/shared/ui/fallback/EmptyState";
import { ErrorMessageWithRefetch } from "@/shared/ui/fallback/ErrorMessage";
import ResultPerformanceListCard from "@/features/performance/ui/desktop/ResultPerformanceListCard";

const PerformancesMobile = () => {
  const {
    filteredPerformances: data,
    isLoading,
    isError,
    refetch,
  } = useResult();

  if (isLoading) {
    return (
      <div className="gap-088 flex w-full flex-col">
        {Array.from({ length: 10 }).map((_, idx) => (
          <PerformanceListCardSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (isError) {
    return <ErrorMessageWithRefetch refetch={refetch} />;
  }

  if (data.length === 0) {
    return <EmptyState text="조건과 일치하는 정보가 없습니다." />;
  }

  return (
    <div className="gap-088 flex w-full flex-col">
      {data.map((performance) => (
        <ResultPerformanceListCard key={performance.title} data={performance} />
      ))}
    </div>
  );
};

const PerformancesDesktop = () => {
  const {
    filteredPerformances: data,
    isLoading,
    isError,
    refetch,
  } = useResult();
  const gridStyle = useDesktopGridStyle();

  if (isLoading) {
    return (
      <div
        className={`grid flex-1 ${gridStyle} p-088 h-full gap-[1.31rem] overflow-y-auto`}
      >
        {Array.from({ length: 10 }).map((_, idx) => (
          <ResultPerformanceAlbumCardSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (isError) {
    return <ErrorMessageWithRefetch refetch={refetch} />;
  }

  return (
    <div className="flex justify-center items-center min-h-100">
      {data.length > 0 ? (
        <div
          className={`grid flex-1 ${gridStyle} p-088 h-full gap-[1.31rem] overflow-y-auto`}
        >
          {data.map((item: ResultPerformance) => (
            <ResultPerformanceAlbumCard key={item.id} data={item} />
          ))}
        </div>
      ) : (
        <span className="text-fallback">검색된 공연이 없습니다.</span>
      )}
    </div>
  );
};

const PerformanceSection = () => {
  const isMobile = useBreakpoint(BREAKPOINTS.TABLET);
  return <>{isMobile ? <PerformancesMobile /> : <PerformancesDesktop />}</>;
};

export default PerformanceSection;
