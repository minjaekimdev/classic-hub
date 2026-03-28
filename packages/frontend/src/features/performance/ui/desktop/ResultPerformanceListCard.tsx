import ComposerList from "../shared/ComposerList";
import { MetaItem } from "../shared/PerformanceMeta";
import type { ResultPerformance } from "@classic-hub/shared/types/client";
import calendarIcon from "@shared/assets/icons/calendar-gray.svg";
import locationIcon from "@shared/assets/icons/location-gray.svg";
import formatDateRange from "@/shared/utils/formatDateRange";
import ResultPriceDisplay from "./ResultPriceDisplay";
import { useResult } from "../../contexts/result-context";
import { getPieceCount } from "./ResultPerformanceAlbumCard/utils";
import { MatchedProgram } from "../shared/MatchedProgram";

const ResultPerformanceListCard = ({ data }: { data: ResultPerformance }) => {
  const { keyword } = useResult();
  const pieceCount = getPieceCount(data.programs);
  return (
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
          <div className="gap-066 flex flex-col">
            <div className="flex flex-col gap-3">
              <p className="line-clamp-2 text-[0.88rem]/[1.1rem] font-semibold text-[#101828]">
                {data.title}
              </p>
              <ComposerList programs={data.programs} />
            </div>
            <div className="flex flex-col">
              <ul className="gap-033 flex flex-col">
                <MetaItem iconSrc={calendarIcon}>
                  {formatDateRange(data.startDate, data.endDate)}
                </MetaItem>
                <MetaItem iconSrc={locationIcon}>{data.venue}</MetaItem>
              </ul>
            </div>
          </div>
        </div>
        {keyword && (
          <MatchedProgram
            program={data.programs}
            keyword={keyword}
            pieceCount={pieceCount}
          />
        )}
        <ResultPriceDisplay minPrice={data.minPrice} maxPrice={data.maxPrice} />
      </div>
    </li>
  );
};

export default ResultPerformanceListCard;
