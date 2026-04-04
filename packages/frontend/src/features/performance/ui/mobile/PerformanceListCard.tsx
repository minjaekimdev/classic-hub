import { Link } from "react-router-dom";
import PerformanceAlbumMeta from "../shared/PerformanceMeta";
import { PriceDisplay } from "../shared/PriceDisplayHome";
import type { PerformanceSummary } from "@classic-hub/shared/types/client";

const PerformanceListCard = ({ data }: { data: PerformanceSummary }) => {
  return (
    <Link to={`/detail/${data.id}`}>
      <li className="group destkop:hidden rounded-main relative flex h-62 cursor-pointer gap-[1.31rem] border border-[rgba(0,0,0,0.1)] bg-white p-[0.94rem] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]">
        <div className="rounded-main relative h-full w-[9.63rem] shrink-0 overflow-hidden">
          <img
            className="h-full w-full transition-transform duration-200 ease-in-out group-hover:scale-105"
            src={data.poster ?? ""}
            alt=""
          />
        </div>
        <div className="flex flex-col justify-between">
          <div className="flex flex-col gap-[0.6rem]">
            <PerformanceAlbumMeta
              title={data.title}
              composers={data.composers}
              startDate={data.startDate}
              endDate={data.endDate}
              venue={data.venue}
            />
          </div>
          <PriceDisplay minPrice={data.minPrice} maxPrice={data.maxPrice} />
        </div>
      </li>
    </Link>
  );
};

export default PerformanceListCard;
