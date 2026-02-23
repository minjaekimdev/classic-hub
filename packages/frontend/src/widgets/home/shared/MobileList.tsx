import PerformanceListCard from "@/features/performance/ui/mobile/PerformanceListCard";
import { PerformanceListSkeleton } from "@/features/performance/ui/mobile/PerformanceListSkeleton";
import { ErrorMessageWithRefetch } from "@/shared/ui/fallback/ErrorMessage";
import type { PerformanceSummary } from "@classic-hub/shared/types/client";
import type { QueryObserverResult } from "@tanstack/react-query";

interface MobileListProps {
  performances: PerformanceSummary[] | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => Promise<QueryObserverResult>;
}

export const MobileList = ({
  performances,
  isLoading,
  isError,
  refetch,
}: MobileListProps) => {
  if (isLoading) {
    return <PerformanceListSkeleton count={5} />;
  }
  if (isError) {
    return <ErrorMessageWithRefetch refetch={refetch} />;
  }

  return (
    <ul className="flex flex-col gap-[0.88rem] w-full">
      {performances!.map((performance) => (
        <PerformanceListCard key={performance.title} data={performance} />
      ))}
    </ul>
  );
};
