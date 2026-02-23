import { useFilter } from "@/features/filter/contexts/filter-context";
import { useResult } from "@/features/performance/contexts/result-context";
import ResultPerformanceAlbumCard from "@/features/performance/ui/desktop/ResultPerformanceAlbumCard";
import PerformanceListCard from "@/features/performance/ui/mobile/PerformanceListCard";
import { BREAKPOINTS } from "@/shared/constants";
import useBreakpoint from "@/shared/hooks/useBreakpoint";
import type { DetailPerformance } from "@classic-hub/shared/types/client";

const PerformancesMobile = () => {
  const { filteredPerformances: data } = useResult();
  return (
    <div className="flex flex-col gap-[0.88rem] w-full">
      {data.map((performance) => (
        <PerformanceListCard key={performance.title} data={performance} />
      ))}
    </div>
  );
};

const PerformancesDesktop = () => {
  const { filteredPerformances: data } = useResult();
  const { isOpen } = useFilter();

  const isDesktop = useBreakpoint(1280);
  const isMobile = useBreakpoint(960);

  let gridStyle;
  // 뷰포트 너비와 필터 열림 여부를 확인하여 그리드 열 개수 설정
  if (!isMobile && isDesktop) {
    gridStyle = isOpen ? "grid-cols-2" : "grid-cols-3";
  } else {
    gridStyle = "grid-cols-4";
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
