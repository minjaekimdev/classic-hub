import { Skeleton } from "@/shared/ui/fallback/Skeleton";

const ResultPerformanceAlbumCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-[0.66rem]">
      <Skeleton className="w-full aspect-10/14 rounded-main border border-[rgba(0,0,0,0.1)]" />
      <div className="grow flex flex-col justify-between rounded-[0.8rem] border border-[rgba(0,0,0,0.1)] bg-white p-[0.88rem]">
        <div className="flex flex-col gap-[0.66rem]">
          <div className="flex flex-col gap-[0.22rem]">
            <div className="flex flex-col gap-1 min-h-[2.2rem]">
              <Skeleton className="h-[0.9rem] w-full" />
              <Skeleton className="h-[0.9rem] w-[70%]" />
            </div>
            <Skeleton className="h-[0.8rem] w-[40%] mt-[0.22rem]" />
          </div>
          <div className="flex flex-col gap-[0.33rem]">
            <div className="flex items-center gap-2">
              <Skeleton className="w-[0.8rem] h-[0.8rem] rounded-full" />
              <Skeleton className="h-[0.7rem] w-[60%]" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="w-[0.8rem] h-[0.8rem] rounded-full" />
              <Skeleton className="h-[0.7rem] w-[50%]" />
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <Skeleton className="h-[1.1rem] w-20" />
          <Skeleton className="w-[2.45rem] h-[1.53rem] rounded-button" />
        </div>
      </div>
    </div>
  );
};

export default ResultPerformanceAlbumCardSkeleton;
