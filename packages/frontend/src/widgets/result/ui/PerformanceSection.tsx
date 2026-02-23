import { useResult } from "@/features/performance/contexts/result-context";
import ResultPerformanceAlbumCard from "@/features/performance/ui/desktop/ResultPerformanceAlbumCard";
import PerformanceListCard from "@/features/performance/ui/mobile/PerformanceListCard";
import { PerformanceListCardSkeleton } from "@/features/performance/ui/mobile/PerformanceListSkeleton";
import { BREAKPOINTS } from "@/shared/constants";
import useBreakpoint from "@/shared/hooks/useBreakpoint";
import type { DetailPerformance } from "@classic-hub/shared/types/client";
import useDesktopGridStyle from "../hooks/usePerformancesDesktop";
import ResultPerformanceAlbumCardSkeleton from "@/features/performance/ui/desktop/ResultPerformanceAlbumCardSkeleton";
import EmptyState from "@/shared/ui/fallback/EmptyState";
import { ErrorMessageWithRefetch } from "@/shared/ui/fallback/ErrorMessage";

const PerformancesMobile = () => {
  const {
    filteredPerformances: data,
    isLoading,
    isError,
    refetch,
  } = useResult();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-[0.88rem] w-full">
        {Array({ length: 10 }).map((_, idx) => (
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
    <div className="flex flex-col gap-[0.88rem] w-full">
      {data.map((performance) => (
        <PerformanceListCard key={performance.title} data={performance} />
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
        className={`flex-1 grid ${gridStyle} gap-[1.31rem] p-[0.88rem] overflow-y-auto h-full`}
      >
        {Array({ length: 30 }).map((_, idx) => (
          <ResultPerformanceAlbumCardSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (isError) {
    return <ErrorMessageWithRefetch refetch={refetch} />;
  }

  return (
    <div
      className={`flex-1 grid ${gridStyle} gap-[1.31rem] p-[0.88rem] overflow-y-auto h-full`}
    >
      {data.map((item: DetailPerformance) => (
        <ResultPerformanceAlbumCard key={item.id} data={item} />
      ))}
    </div>
  );
};

const PerformanceSection = () => {
  const isMobile = useBreakpoint(BREAKPOINTS.TABLET);
  return <>{isMobile ? <PerformancesMobile /> : <PerformancesDesktop />}</>;
};

export default PerformanceSection;
