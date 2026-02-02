import PerformanceListCard from "@/entities/performance/ui/mobile/PerformanceListCard";
import type { HomePerformance } from "@classic-hub/shared/types/client";

const MobileList = ({
  performanceArray,
}: {
  performanceArray: HomePerformance[];
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
