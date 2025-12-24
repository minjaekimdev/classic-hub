import type { PerformanceSummary } from "@classic-hub/shared/types/performance";
import MetaData from "./MetaData";
import ResultPriceDisplay from "./ResultPriceDisplay";
import BookmarkButton from "@/shared/ui/buttons/BookmarkButton";

interface ResultAlbumItemProps {
  data: PerformanceSummary;
}

const ResultAlbumItem = ({ data }: ResultAlbumItemProps) => {
  return (
    <div className="flex flex-col gap-[0.66rem]">
      <div className="relative rounded-main overflow-hidden aspect-10/14">
        <img className="w-full h-full" src={data.posterUrl} alt="공연 포스터" />
        <BookmarkButton className="bookmark-position" />
      </div>
      <div className="grow flex flex-col justify-between p-[0.88rem]">
        <MetaData
          title={data.title}
          artist={data.artist}
          date={data.date}
          time={data.time}
          venue={data.venue}
          composerArray={data.composerArray}
        />
        <div className="flex justify-between items-center">
          <ResultPriceDisplay
            minPrice={data.price.min}
            maxPrice={data.price.max}
          />
          <button className="flex justify-center items-center rounded-button bg-main mt-4 w-[2.45rem] h-[1.53rem] text-white text-[0.66rem]/[0.88rem] font-medium transition-scale hover:scale-105 ease-in-out duration-200">
            예매
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultAlbumItem;
