import Bookmark from "@/shared/ui/buttons/BookmarkButton";
import type { HomePerformance } from "@classic-hub/shared/types/performance";
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
      <Bookmark style={{ top: "0.66rem", right: "0.66rem" }} />
    </div>
  );
};

type ListItemProps = {
  data: HomePerformance;
};
const ListItem = ({ data }: ListItemProps) => {
  // const getPrice = () => {
  //   if (data.price.min === data.price.max) {
  //     if (data.price.min === 0) {
  //       return <span>전석 무료</span>;
  //     }
  //     return <span>전석 {data.price.min.toLocaleString()}원</span>;
  //   } else {
  //     return (
  //       <>
  //         {data.price.min.toLocaleString()}원
  //         <span className="text-[#6a7282] text-[0.77rem]/[1.1rem]"> ~ </span>
  //         {data.price.max.toLocaleString()}원
  //       </>
  //     );
  //   }
  // };
  return (
    <li className="group flex destkop:hidden gap-[1.31rem] p-[0.94rem] h-62 rounded-main border border-[rgba(0,0,0,0.1)] bg-white cursor-pointer hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]">
      <MobileCard imgSrc={data.posterUrl} />
      <div className="flex flex-col justify-between">
        <div className="flex flex-col gap-[0.6rem]">
          <PerformanceAlbumMeta
            title={data.title}
            artist={data.artist}
            composerArray={data.composerArray}
            date={data.date}
            time={data.time}
            venue={data.venue}
          />
        </div>
        {/* <p className="text-dark text-[1rem]/[1.53rem] font-semibold">
          {getPrice()}
        </p> */}
        <PriceDisplay isMobile={true} minPrice={data.price.min} maxPrice={data.price.max} />
      </div>
    </li>
  );
};

export default ListItem;
