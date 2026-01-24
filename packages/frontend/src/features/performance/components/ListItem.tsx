import Bookmark from "@/shared/ui/buttons/BookmarkButton";
import type { HomePerformance } from "@classic-hub/shared/types/client";
import PerformanceAlbumMeta from "./MetaData";
import PriceDisplay from "./PriceDisplay";

interface CardProps {
  imgSrc: string;
  rank?: string;
}

const MobileCard: React.FC<CardProps> = ({ imgSrc }) => {
  return (
    <div className="relative w-[9.63rem] h-full rounded-main shrink-0 overflow-hidden">
      <img
        className="group-hover:scale-105 w-full h-full transition-transform duration-200 ease-in-out"
        src={imgSrc}
        alt=""
      />
      <Bookmark className="bookmark-position" />
    </div>
  );
};

type ListItemProps = {
  data: HomePerformance;
};
const ListItem = ({ data }: ListItemProps) => {
  return (
    <li className="group flex destkop:hidden gap-[1.31rem] p-[0.94rem] h-62 rounded-main border border-[rgba(0,0,0,0.1)] bg-white cursor-pointer hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]">
      <MobileCard imgSrc={data.poster} />
      <div className="flex flex-col justify-between">
        <div className="flex flex-col gap-[0.6rem]">
          <PerformanceAlbumMeta
            title={data.title}
            artist={data.artist}
            period={data.period}
            venue={data.venue}
          />
        </div>
        <PriceDisplay isMobile={true} minPrice={data.price.min} maxPrice={data.price.max} />
      </div>
    </li>
  );
};

export default ListItem;
