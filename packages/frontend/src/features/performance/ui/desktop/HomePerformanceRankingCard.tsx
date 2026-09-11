import { Link } from "react-router-dom";
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
      className={`absolute z-10 flex shrink-0 items-center justify-center rounded-full bg-linear-to-b from-[#cc0000] to-[#990000] p-[0.47rem_0.65rem_0.38rem] text-[0.77rem]/[1.09rem] font-bold text-white ${
        className || ""
      }`}
    >
      {children}
    </div>
  );
};

export const HomePerformanceRankingCard = ({
  data,
}: {
  data: PerformanceSummary;
}) => {
  return (
    <Link to={`/detail/${data.id}`} target="_blank">
      {/* // group 클래스를 지정하여 해당 요소 hover시 자식의 스타일이 바뀌도록(transform: scale(1.05)) */}
      <div className="group rounded-main flex w-full cursor-pointer flex-col overflow-hidden bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] transition-shadow duration-200 ease-in-out hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]">
        <div className="relative aspect-10/14 overflow-hidden">
          <img
            className="transition-scale h-full w-full duration-200 ease-in-out group-hover:scale-105"
            src={data.poster ?? ""}
            alt=""
          />
          <RankBadge className="top-066 left-088">{data.rank}위</RankBadge>
        </div>
        <div className="p-088 flex grow flex-col justify-between">
          <PerformanceMeta
            title={data.title}
            startDate={data.startDate}
            endDate={data.endDate}
            venue={data.venue}
            composers={data.composers}
          />
          <div className="mt-3">
            <PriceDisplay minPrice={data.minPrice} maxPrice={data.maxPrice} />
          </div>
        </div>
      </div>
    </Link>
  );
};
