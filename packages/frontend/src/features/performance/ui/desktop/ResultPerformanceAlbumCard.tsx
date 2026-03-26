import ResultPriceDisplay from "./ResultPriceDisplay";
import { Link } from "react-router-dom";
import { MetaItem } from "../shared/PerformanceMeta";
import calendarIcon from "@shared/assets/icons/calendar-gray.svg";
import locationIcon from "@shared/assets/icons/location-gray.svg";
import formatDateRange from "@/shared/utils/formatDateRange";
import type { ResultPerformance } from "@classic-hub/shared/types/client";
import { useResult } from "../../contexts/result-context";
import type { Program } from "@classic-hub/shared/types/common";
import ComposerList from "../shared/ComposerList";

export interface ProgramMatchResult {
  composer: string | null;
  piece: string | null;
  highlight: "composer" | "piece";
}
const getMatchedProgram = (
  program: Program[],
  keyword: string,
): ProgramMatchResult | null => {
  // 키워드가 존재하지 않거나, program이 존재하지 않는다면 null 리턴
  if (!program || program.length === 0) {
    return null;
  }

  for (const item of program) {
    if (item.composerKo?.includes(keyword)) {
      return {
        composer: item.composerKo,
        piece: item.workTitleKr[0] ?? null,
        highlight: "composer",
      };
    }
    if (item.workTitleKr.length > 0) {
      const matchedPiece = item.workTitleKr.find((work) =>
        work.includes(keyword),
      );
      if (matchedPiece) {
        return {
          composer: item.composerKo,
          piece: matchedPiece,
          highlight: "piece",
        };
      }
    }
    if (item.composerEn?.includes(keyword)) {
      return {
        composer: item.composerEn,
        piece: item.workTitleEn[0] ?? null,
        highlight: "composer",
      };
    }
    if (item.workTitleEn.length > 0) {
      const matchedPiece = item.workTitleEn.find((work) =>
        work.includes(keyword),
      );
      if (matchedPiece) {
        return {
          composer: item.composerEn,
          piece: matchedPiece,
          highlight: "piece",
        };
      }
    }
  }

  // 아무것도 매칭되지 않았으면 null 반환
  return null;
};

const ProgramString = ({ composer, piece, highlight }: ProgramMatchResult) => {
  if (composer && piece) {
    return highlight === "composer" ? (
      <p className="">
        프로그램: <span className="font-semibold">{composer}</span>
        {" - "}
        <span>{piece}</span>
      </p>
    ) : (
      <p className="">
        프로그램: <span>{composer}</span>
        {" - "}
        <span className="font-semibold">{piece}</span>
      </p>
    );
  } else if (composer && !piece) {
    return (
      <p className="">
        작곡가: <span className="font-semibold">{composer}</span>
      </p>
    );
  } else if (!composer && piece) {
    return (
      <p className="">
        연주곡: <span className="font-semibold">{piece}</span>
      </p>
    );
  }
};

interface MatchedProgramProps {
  program: Program[];
  keyword: string;
}
const MatchedProgram = ({ program, keyword }: MatchedProgramProps) => {
  const matchedProgram = getMatchedProgram(program, keyword);
  if (!matchedProgram) return null;
  const { composer, piece, highlight } = matchedProgram;

  return (
    <div className="">
      <ProgramString composer={composer} piece={piece} highlight={highlight} />
    </div>
  );
};

const ResultPerformanceAlbumCard = ({ data }: { data: ResultPerformance }) => {
  const { keyword } = useResult();
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
              <MatchedProgram program={data.programs} keyword={keyword} />
            )}
          </div>
          <div className="mt-4 flex items-center justify-between">
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
