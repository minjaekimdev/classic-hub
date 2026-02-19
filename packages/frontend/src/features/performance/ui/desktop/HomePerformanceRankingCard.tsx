import { Link } from "react-router-dom";
import BookmarkButtonDesktop from "@/shared/ui/buttons/BookmarkButtonDesktop";
import PerformanceMeta from "../shared/PerformanceMeta";
import { PriceDisplay } from "../shared/PriceDisplayHome";
import type { PerformanceSummary } from "@classic-hub/shared/types/client";

interface CardBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export const RankBadge = ({ children, className }: CardBadgeProps) => {
  return (
    <div
      className={`absolute z-10 shrink-0 flex justify-center items-center rounded-full p-[0.47rem_0.65rem_0.38rem] bg-linear-to-b from-[#cc0000] to-[#990000] text-white text-[0.77rem]/[1.09rem] font-bold ${
        className || ""
      }`}
    >
      {children}
    </div>
  );
};

export const HomePerformanceRankingCard = ({ data }: { data: PerformanceSummary }) => {
  return (
    <Link to={`/detail/${data.id}`}>
      {/* // group 클래스를 지정하여 해당 요소 hover시 자식의 스타일이 바뀌도록(transform: scale(1.05)) */}
      <div className="group flex flex-col rounded-main bg-white w-full shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] overflow-hidden transition-shadow duration-200 ease-in-out hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)] cursor-pointer">
        <div className="relative overflow-hidden aspect-10/14">
          <img
            className="w-full h-full group-hover:scale-105 transition-scale duration-200 ease-in-out"
            src={data.poster ?? ""}
            alt=""
          />
          <RankBadge className="top-[0.66rem] left-[0.66rem]">
            {data.rank}위
          </RankBadge>
          <div className="hidden desktop:block bookmark-position">
            <BookmarkButtonDesktop />
          </div>
        </div>
        <div className="grow flex flex-col justify-between p-[0.88rem]">
          <PerformanceMeta
            title={data.title}
            artist={data.artist}
            startDate={data.startDate}
            endDate={data.endDate}
            venue={data.venue}
          />
          <div className="mt-3">
            <PriceDisplay minPrice={data.minPrice} maxPrice={data.maxPrice} />
          </div>
        </div>
      </div>
    </Link>
  );
};
