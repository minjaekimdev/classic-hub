import ResultPerformanceAlbumCard from "@/features/performance/ui/desktop/ResultPerformanceAlbumCard";
import PerformanceListCard from "@/features/performance/ui/mobile/PerformanceListCard";
import { useFilter, useResult } from "@/pages/Result";
import { BREAKPOINTS } from "@/shared/constants";
import useBreakpoint from "@/shared/hooks/useBreakpoint";

const ResultMobile = () => {
  const data = useResult();
  return (
    <div className="flex flex-col gap-[0.88rem] w-full">
      {data.map((performance) => (
        <PerformanceListCard key={performance.title} data={performance} />
      ))}
    </div>
  );
};

const ResultDesktop = () => {
  const data = useResult();
  const { isFilterOpened } = useFilter();

  const isDesktop = useBreakpoint(1280);
  const isMobile = useBreakpoint(960);

  let gridStyle;
  // 뷰포트 너비와 필터 열림 여부를 확인하여 그리드 열 개수 설정
  if (!isMobile && isDesktop) {
    gridStyle = isFilterOpened ? "grid-cols-2" : "grid-cols-3";
  } else {
    gridStyle = "grid-cols-4";
  }
  return (
    <div
      className={`flex-1 grid ${gridStyle} gap-[1.31rem] p-[0.88rem] overflow-y-auto`}
    >
      {data.map((item) => (
        <ResultPerformanceAlbumCard data={item} />
      ))}
    </div>
  );
};

const PerformanceSection = () => {
  const isMobile = useBreakpoint(BREAKPOINTS.TABLET);
  return <>{isMobile ? <ResultMobile /> : <ResultDesktop />}</>;
};

export default PerformanceSection;
