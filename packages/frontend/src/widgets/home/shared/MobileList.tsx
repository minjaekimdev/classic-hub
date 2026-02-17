import PerformanceListCard from "@/features/performance/ui/mobile/PerformanceListCard";
import { PerformanceListSkeleton } from "@/features/performance/ui/mobile/PerformanceListSkeleton";
import { ErrorMessage } from "@/shared/ui/fallback/ErrorMessage";
import type { PerformanceSummary } from "@classic-hub/shared/types/client";

interface MobileListProps {
  performances: PerformanceSummary[] | undefined;
  isLoading: boolean;
  isError: boolean;
}

export const MobileList = ({ performances, isLoading, isError }: MobileListProps) => {
  if (isLoading) {
    return <PerformanceListSkeleton count={5} />
  }
  if (isError) {
    return <ErrorMessage title="공연" />
  }
  
  return (
    <ul className="flex flex-col gap-[0.88rem] w-full">
      {performances!.map((performance) => (
        <PerformanceListCard key={performance.title} data={performance} />
      ))}
    </ul>
  );
};
