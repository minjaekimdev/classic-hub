import React from "react";
import RankBadge from "@/shared/ui/badges/RankBadge";
import Bookmark from "@/shared/ui/buttons/BookmarkButton";
import type { HomePerformance } from "@classic-hub/shared/types/client";
import PerformanceAlbumMeta from "@/features/performance/components/MetaData";
import PriceDisplay from "./PriceDisplay";
import { Link } from "react-router-dom";

interface CardProps {
  imgSrc: string;
  rank?: number;
}

const Card: React.FC<CardProps> = ({ imgSrc, rank }) => {
  return (
    <div className="relative overflow-hidden aspect-10/14">
      <img
        className="w-full h-full group-hover:scale-105 transition-scale duration-200 ease-in-out"
        src={imgSrc}
        alt=""
      />
      {rank && (
        <RankBadge className="top-[0.66rem] left-[0.66rem]">{rank}위</RankBadge>
      )}
      <Bookmark className="bookmark-position" />
    </div>
  );
};

type InfoProps = Omit<HomePerformance, "id" | "poster" | "rank" | "poster">;
const Info = ({ title, artist, period, venue, price }: InfoProps) => {
  return (
    <div className="grow flex flex-col justify-between p-[0.88rem]">
      <PerformanceAlbumMeta
        title={title}
        artist={artist}
        period={period}
        venue={venue}
      />
      <div className="mt-3">
        <PriceDisplay
          isMobile={false}
          minPrice={price.min}
          maxPrice={price.max}
        />
      </div>
    </div>
  );
};

interface AlbumItemProps {
  data: HomePerformance;
}

const AlbumItem = ({ data }: AlbumItemProps) => {
  return (
    <Link to={`/detail/${data.id}`}>
      {/* // group 클래스를 지정하여 해당 요소 hover시 자식의 스타일이 바뀌도록(transform: scale(1.05)) */}
      <div className="group flex flex-col rounded-main bg-white w-full shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] overflow-hidden transition-shadow duration-200 ease-in-out hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)] cursor-pointer">
        <Card imgSrc={data.poster} rank={data.rank} />
        <Info
          title={data.title}
          artist={data.artist}
          period={data.period}
          venue={data.venue}
          price={data.price}
        />
      </div>
    </Link>
  );
};

export default AlbumItem;
