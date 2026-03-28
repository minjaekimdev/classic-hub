import ResultPriceDisplay from "../ResultPriceDisplay";
import { Link } from "react-router-dom";
import { MetaItem } from "../../shared/PerformanceMeta";
import calendarIcon from "@shared/assets/icons/calendar-gray.svg";
import locationIcon from "@shared/assets/icons/location-gray.svg";
import formatDateRange from "@/shared/utils/formatDateRange";
import type { ResultPerformance } from "@classic-hub/shared/types/client";
import { useResult } from "../../../contexts/result-context";
import ComposerList from "../../shared/ComposerList";
import { getPieceCount } from "./utils";
import { MatchedProgram } from "../../shared/MatchedProgram";

const ResultPerformanceAlbumCard = ({ data }: { data: ResultPerformance }) => {
  const { keyword } = useResult();
  const pieceCount = getPieceCount(data.programs);
  return (
    <Link to={`/detail/${data.id}`} target="_blank">
      <div className="gap-066 flex cursor-pointer flex-col">
        <div className="rounded-main relative aspect-10/14 overflow-hidden border border-[rgba(0,0,0,0.1)]">
          <img
            className="h-full w-full"
            src={data.poster ?? ""}
            alt="공연 포스터"
          />
        </div>
        <div className="p-088 flex grow flex-col justify-between rounded-[0.8rem] border border-[rgba(0,0,0,0.1)] bg-white">
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
          <div className="">
            {keyword && (
              <MatchedProgram
                program={data.programs}
                keyword={keyword}
                pieceCount={pieceCount}
              />
            )}
          </div>
          <div className="flex items-center justify-between">
            <ResultPriceDisplay
              minPrice={data.minPrice}
              maxPrice={data.maxPrice}
            />
            <button className="rounded-button bg-main transition-scale flex h-[1.53rem] w-[2.45rem] items-center justify-center text-[0.66rem]/[0.88rem] font-medium text-white duration-200 ease-in-out hover:scale-105">
              예매
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ResultPerformanceAlbumCard;
