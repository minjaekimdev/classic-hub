import { Skeleton } from "@/shared/ui/fallback/Skeleton";

export const HomePerformanceAlbumCardSkeleton = () => {
  return (
    <div className="flex flex-col rounded-main bg-white w-full shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] overflow-hidden">
      {/* 포스터 영역 (aspect-10/14 유지) */}
      <div className="relative overflow-hidden aspect-10/14">
        <Skeleton className="w-full h-full" />
        
        {/* 랭크 배지 자리 (필요 시) */}
        <div className="absolute top-[0.66rem] left-[0.66rem]">
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
      </div>

      {/* 정보 영역 (p-[0.88rem] 동일하게 적용) */}
      <div className="grow flex flex-col justify-between p-[0.88rem]">
        <div className="flex flex-col gap-2">
          {/* 제목 (Title) */}
          <Skeleton className="h-6 w-3/4 mb-1" />
          {/* 아티스트 (Artist) */}
          <Skeleton className="h-4 w-1/2" />
          {/* 기간/장소 (Meta Info) */}
          <div className="flex flex-col gap-1 mt-1">
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>

        {/* 가격 표시 영역 (mt-3 동일하게 적용) */}
        <div className="mt-3">
          <Skeleton className="h-7 w-1/3" />
        </div>
      </div>
    </div>
  );
};