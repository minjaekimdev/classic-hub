import ResultPriceDisplay from "../ResultPriceDisplay";
import { Link } from "react-router-dom";
import { MetaItem } from "../../shared/PerformanceMeta";
import calendarIcon from "@shared/assets/icons/calendar-gray.svg";
import locationIcon from "@shared/assets/icons/location-gray.svg";
import formatDateRange from "@/shared/utils/formatDateRange";
import type { ResultPerformance } from "@classic-hub/shared/types/client";
import { useResult } from "../../../contexts/result-context";
import type { Program } from "@classic-hub/shared/types/common";
import ComposerList from "../../shared/ComposerList";
import noteIcon from "@shared/assets/icons/single-note-red.svg";
import { getPieceCount, getProgramInfo } from "./utils";

const CalloutLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="callout-box my-088">
      <div className="gap-022 flex items-start">
        <img src={noteIcon} className="relative top-0.5" />
        {children}
      </div>
    </div>
  );
};

interface MatchedProgramProps {
  program: Program[];
  keyword: string;
  pieceCount: number;
}
const MatchedProgram = ({
  program,
  keyword,
  pieceCount,
}: MatchedProgramProps) => {
  const matchedProgram = getProgramInfo(program, keyword);
  if (!matchedProgram) return null;
  const { composer, piece } = matchedProgram;

  return (
    <CalloutLayout>
      {/* 작곡가명이 매칭된 경우 */}
      {composer && composer.length === 3 && (
        <p>
          <span>
            {composer[0]}
            <mark className="font-semibold">{composer[1]}</mark>
            {composer[2]}
          </span>
          {piece ? (
            <span>
              : {piece} 외 {pieceCount - 1}곡
            </span>
          ) : (
            <span> (세부 곡명 미정)</span>
          )}
        </p>
      )}

      {/* 곡명이 매칭된 경우 */}
      {piece && piece.length === 3 && (
        <p>
          {composer ? <span>{composer}: </span> : ""}
          <span>
            {piece[0]}
            <mark className="font-semibold">{piece[1]}</mark>
            {piece[2]} 외 {pieceCount - 1}곡
          </span>
        </p>
      )}
    </CalloutLayout>
  );
};

const ResultPerformanceAlbumCard = ({ data }: { data: ResultPerformance }) => {
  const { keyword } = useResult();
  const pieceCount = getPieceCount(data.programs);
  console.log(data.programs);
  return (
    <Link to={`/detail/${data.id}`}>
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
              <ul className="flex flex-col gap-[0.33rem]">
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
