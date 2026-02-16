import PerformanceListCard from "@/features/performance/ui/mobile/PerformanceListCard";
import type { PerformanceSummary } from "@classic-hub/shared/types/client";

const MobileList = ({
  performanceArray,
}: {
  performanceArray: PerformanceSummary[];
}) => {
  return (
    <ul className="flex flex-col gap-[0.88rem] w-full">
      {performanceArray.map((performance) => (
        <PerformanceListCard key={performance.title} data={performance} />
      ))}
    </ul>
  );
};

export default MobileList;
