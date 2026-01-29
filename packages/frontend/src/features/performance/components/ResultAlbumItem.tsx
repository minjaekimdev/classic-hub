import type { PerformanceSummary } from "@classic-hub/shared/types/client";
import MetaData from "./MetaData";
import ResultPriceDisplay from "./ResultPriceDisplay";
import BookmarkButton from "@/shared/ui/buttons/BookmarkButtonMobile";

const ResultAlbumItem = ({ data }: {data: PerformanceSummary}) => {
  return (
    <div className="flex flex-col gap-[0.66rem] cursor-pointer">
      <div className="relative rounded-main border border-[rgba(0,0,0,0.1)] overflow-hidden aspect-10/14">
        <img className="w-full h-full" src={data.poster} alt="공연 포스터" />
        <div className="bookmark-position">
          <BookmarkButton />
        </div>
      </div>
      <div className="grow flex flex-col justify-between rounded-[0.8rem] border border-[rgba(0,0,0,0.1)] bg-white p-[0.88rem]">
        <MetaData
          title={data.title}
          artist={data.artist}
          period={data.period}
          venue={data.venue}
        />
        <div className="flex justify-between items-center mt-4">
          <ResultPriceDisplay
            minPrice={data.price.min}
            maxPrice={data.price.max}
          />
          <button className="flex justify-center items-center rounded-button bg-main w-[2.45rem] h-[1.53rem] text-white text-[0.66rem]/[0.88rem] font-medium transition-scale hover:scale-105 ease-in-out duration-200">
            예매
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultAlbumItem;
