import React from "react";
import CardBadge from "@/shared/ui/CardBadge";
import Bookmark from "@/shared/ui/buttons/BookmarkButton";
import type { HomePerformance } from "@classic-hub/shared/types/performance";
import PerformanceAlbumMeta from "@/features/performance/components/MetaData";
import PriceDisplay from "./PriceDisplay";

interface CardProps {
  imgSrc: string;
  rank?: number;
}

const Card: React.FC<CardProps> = ({ imgSrc, rank }) => {
  return (
    <div className="relative overflow-hidden h-[60%]">
      <img
        className="w-full h-full group-hover:scale-105 transition-scale duration-200 ease-in-out"
        src={imgSrc}
        alt=""
      />
      {rank && (
        <CardBadge style={{ top: "0.66rem", left: "0.66rem" }}>
          {rank}위
        </CardBadge>
      )}
      <Bookmark style={{ top: "0.66rem", right: "0.66rem" }} />
    </div>
  );
};

type InfoProps = Omit<HomePerformance, "id" | "posterUrl" | "rank">;
const Info = ({
  title,
  artist,
  composerArray,
  date,
  time,
  venue,
  price,
}: InfoProps) => {
  return (
    <div className="flex flex-col justify-between p-[0.88rem] h-[40%]">
      <PerformanceAlbumMeta
        title={title}
        artist={artist}
        composerArray={composerArray}
        date={date}
        time={time}
        venue={venue}
      />
      {/* <div className="flex">{getPriceText()}</div> */}
      <PriceDisplay
        isMobile={false}
        minPrice={price.min}
        maxPrice={price.max}
      />
    </div>
  );
};

interface AlbumItemProps {
  data: HomePerformance;
}

const AlbumItem = ({ data }: AlbumItemProps) => {
  return (
    // group 클래스를 지정하여 해당 요소 hover시 자식의 스타일이 바뀌도록(transform: scale(1.05))
    <li className="group flex flex-col rounded-main bg-white w-full aspect-13/30 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] overflow-hidden transition-shadow duration-200 ease-in-out hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)] cursor-pointer">
      <Card imgSrc={data.posterUrl} rank={data.rank} />
      <Info
        title={data.title}
        artist={data.artist}
        composerArray={data.composerArray}
        date={data.date}
        time={data.time}
        venue={data.venue}
        price={data.price}
      />
    </li>
  );
};

export default AlbumItem;
