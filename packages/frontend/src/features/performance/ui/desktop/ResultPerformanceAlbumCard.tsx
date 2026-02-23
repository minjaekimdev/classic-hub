import type { DetailPerformance } from "@classic-hub/shared/types/client";
import MetaData from "../shared/PerformanceMeta";
import ResultPriceDisplay from "./ResultPriceDisplay";
import { Link } from "react-router-dom";

const ResultPerformanceAlbumCard = ({ data }: { data: DetailPerformance }) => {
  return (
    <Link to={`/detail/${data.id}`}>
      <div className="flex flex-col gap-[0.66rem] cursor-pointer">
        <div className="relative rounded-main border border-[rgba(0,0,0,0.1)] overflow-hidden aspect-10/14">
          <img className="w-full h-full" src={data.poster ?? ""} alt="공연 포스터" />
        </div>
        <div className="grow flex flex-col justify-between rounded-[0.8rem] border border-[rgba(0,0,0,0.1)] bg-white p-[0.88rem]">
          <MetaData
            title={data.title}
            artist={data.artist}
            startDate={data.startDate}
            endDate={data.endDate}
            venue={data.venue}
          />
          <div className="flex justify-between items-center mt-4">
            <ResultPriceDisplay
              minPrice={data.minPrice}
              maxPrice={data.maxPrice}
            />
            <button className="flex justify-center items-center rounded-button bg-main w-[2.45rem] h-[1.53rem] text-white text-[0.66rem]/[0.88rem] font-medium transition-scale hover:scale-105 ease-in-out duration-200">
              예매
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ResultPerformanceAlbumCard;
