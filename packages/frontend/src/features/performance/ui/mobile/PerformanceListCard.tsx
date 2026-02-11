import type { DetailPerformance } from "@classic-hub/shared/types/client";
import PerformanceAlbumMeta from "../shared/PerformanceMeta";
import PriceDisplay from "../shared/PriceDisplay";
import BookmarkButton from "@/shared/ui/buttons/BookmarkButtonMobile";
import formatDateRange from "@/shared/utils/formatDateRange";

const PerformanceListCard = ({ data }: { data: DetailPerformance }) => {
  return (
    <li className="group relative flex destkop:hidden gap-[1.31rem] p-[0.94rem] h-62 rounded-main border border-[rgba(0,0,0,0.1)] bg-white cursor-pointer hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]">
      <div className="relative w-[9.63rem] h-full rounded-main shrink-0 overflow-hidden">
        <img
          className="group-hover:scale-105 w-full h-full transition-transform duration-200 ease-in-out"
          src={data.poster}
          alt=""
        />
        <div className="bookmark-position">
          <BookmarkButton />
        </div>
      </div>
      <div className="flex flex-col justify-between">
        <div className="flex flex-col gap-[0.6rem]">
          <PerformanceAlbumMeta
            title={data.title}
            artist={data.artist}
            period={formatDateRange(data.startDate, data.endDate)}
            venue={data.venue}
          />
        </div>
        <PriceDisplay
          isMobile={true}
          minPrice={data.minPrice}
          maxPrice={data.maxPrice}
        />
      </div>
    </li>
  );
};

export default PerformanceListCard;
