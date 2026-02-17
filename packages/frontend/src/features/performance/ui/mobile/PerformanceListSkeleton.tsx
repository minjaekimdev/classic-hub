import { Skeleton } from "@/shared/ui/fallback/Skeleton";

export const PerformanceListCardSkeleton = () => {
  return (
    <li className="group relative flex desktop:hidden gap-[1.31rem] p-[0.94rem] h-62 rounded-main border border-[rgba(0,0,0,0.1)] bg-white">
      <div className="relative w-[9.63rem] h-full rounded-main shrink-0 overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="flex flex-col justify-between flex-1 w-full">
        <div className="flex flex-col gap-[0.66rem]">
          <div className="flex flex-col gap-[0.22rem]">
            <Skeleton className="h-[2.2rem] w-full" />
            <Skeleton className="h-[1.09rem] w-1/2" />
          </div>
          <div className="flex flex-col">
            <ul className="flex flex-col gap-[0.33rem]">
              <Skeleton className="h-[0.88rem] w-3/4" />
              <Skeleton className="h-[0.88rem] w-2/3" />
            </ul>
          </div>
        </div>
        <div className="w-full">
          <Skeleton className="h-[1.1rem] w-20" />
        </div>
      </div>
    </li>
  );
};

export const PerformanceListSkeleton = ({ count }: { count: number }) => {
  return (
    <ul className="flex flex-col gap-[0.88rem] w-full">
      {Array.from({ length: count }, () => (
        <PerformanceListCardSkeleton />
      ))}
    </ul>
  );
};
