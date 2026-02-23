import { Skeleton } from "@/shared/ui/fallback/Skeleton";

const DetailVenueInfoSkeleton = () => {
  return (
    <div className="flex flex-col gap-[0.88rem] px-[0.88rem] py-[1.09rem] desktop:p-0">
      <h3 className="text-dark text-[0.88rem]/[1.31rem] font-semibold">공연장 정보</h3>
      <div className="flex flex-col gap-[1.31rem]">
        {/* 공연장 이름 위치 */}
        <Skeleton className="h-[1.09rem] w-1/3" /> 
        
        <div className="grid grid-cols-2 gap-[0.88rem]">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-[0.66rem]">
              <Skeleton className="mt-1 w-[0.88rem] h-[0.88rem] rounded-full" />
              <div className="flex flex-col gap-[0.22rem] w-full">
                <Skeleton className="h-[1.31rem] w-12" />
                <Skeleton className="h-[1.31rem] w-3/4" />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-[0.66rem]">
          <Skeleton className="h-[1.31rem] w-16" />
          <div className="flex gap-[0.44rem]">
            <Skeleton className="h-[1.8rem] w-14 rounded-full" />
            <Skeleton className="h-[1.8rem] w-14 rounded-full" />
            <Skeleton className="h-[1.8rem] w-14 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailVenueInfoSkeleton;