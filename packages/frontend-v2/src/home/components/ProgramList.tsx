/**
 * specs/home.md 구현 정책
 * - card-007: 작곡가 정보가 없는 프로그램은 곡 목록만 표기
 * - card-009/010: card-009 바텀시트 / card-010 팝오버에 렌더링되는 전체 프로그램 목록
 * - search-008: 검색어와 일치하는 곡은 gold 언더라인으로 표시
 * - (수정안) 곡 번호(1, 2, 3…)는 작곡가 그룹을 넘어 연속 부여해 실제 연주 순서를 나타내고,
 *   스크롤 중 작곡가 그룹 헤더는 고정된다
 *   (디자인: prototype/홈페이지 수정안 · prototype/전체 프로그램 바텀시트(모바일)과 동일 값)
 */
import { findMatchedProgramWork, type MatchedProgramWork } from "@/lib/program";
import type { ConcertProgram } from "@/types/concert";

interface ProgramListProps {
  programs: ConcertProgram[];
  /** "flyout": 데스크톱 호버 팝오버 / "sheet": 모바일 바텀시트 */
  variant: "flyout" | "sheet";
  /** 현재 검색어 — 일치하는 곡에 gold 언더라인 표시 (specs search-008) */
  searchQuery?: string;
}

interface WorkProps {
  number: number;
  /** search-008: 검색어와 일치한 곡 — 한글 제목에 gold 언더라인 표시 */
  isMatched: boolean;
  titleKo: string | null;
  titleEn: string | null;
  variant: "flyout" | "sheet";
}

function Work({ number, isMatched, titleKo, titleEn, variant }: WorkProps) {
  const main = titleKo ?? titleEn;
  if (!main) return null;

  const matchedClass = isMatched
    ? "font-semibold text-secondary underline decoration-[rgba(200,162,74,0.65)] decoration-[1.5px] underline-offset-[3px]"
    : "font-semibold text-primary";

  const numberEl = (
    <span
      aria-hidden="true"
      className={
        variant === "flyout"
          ? "mt-0.5 w-4 shrink-0 text-right font-serif text-xs font-bold text-secondary"
          : "mt-1 w-5 shrink-0 text-right font-serif text-sm font-bold text-secondary"
      }
    >
      {number}
    </span>
  );

  if (variant === "flyout") {
    return (
      <div className="flex gap-2.5">
        {numberEl}
        <div className="min-w-0 flex-1 space-y-0.5 leading-snug">
          <p className={`text-[13px] ${matchedClass}`}>{main}</p>
          {titleKo && titleEn && (
            <p className="font-serif text-[11px] italic text-on-surface-variant/80">{titleEn}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2.5">
      {numberEl}
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className={`text-[13.5px] ${matchedClass}`}>{main}</p>
        {titleKo && titleEn && (
          <p className="font-serif text-[11.5px] italic text-on-surface-variant/80">{titleEn}</p>
        )}
      </div>
    </div>
  );
}

/** 전체 연주 프로그램을 작곡가별로 묶어 표기한다 (specs card-009, card-010) */
export default function ProgramList({ programs, variant, searchQuery = "" }: ProgramListProps) {
  // search-008: 일치하는 곡을 찾아 목록에서 언더라인으로 표시한다
  const matchedWork: MatchedProgramWork | null = searchQuery
    ? findMatchedProgramWork(programs, searchQuery)
    : null;
  // 곡 번호는 작곡가 그룹을 넘어 연속 부여한다 (1, 2, 3… = 실제 연주 순서)
  let workNumber = 0;

  return (
    <div className={variant === "flyout" ? "space-y-5" : "space-y-6"}>
      {programs.map((program, programIndex) => {
        const composerKo = program.composerKo ?? program.composerEn;
        const composerEn = program.composerKo ? program.composerEn : null;
        // 그룹 헤더는 목록 스크롤 중에도 고정 — 긴 프로그램에서 현재 작곡가를 항상 보여준다
        const composerHeader = composerKo ? (
          <div className="sticky top-0 z-[1] -mx-1 flex items-baseline justify-between gap-2 bg-surface-container-lowest px-1 py-0.5">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <h4
                className={
                  variant === "flyout"
                    ? "text-[13px] font-bold text-primary"
                    : "text-[15px] font-bold text-primary"
                }
              >
                {composerKo}
              </h4>
              {composerEn && (
                <span className="font-serif text-[11px] italic text-on-surface-variant/80">
                  {composerEn}
                </span>
              )}
            </div>
            <span className="text-[11px] text-on-surface-variant">
              {program.titles.length}곡
            </span>
          </div>
        ) : null;

        const works = program.titles.map((title, titleIndex) => {
          workNumber += 1;
          const isMatched = matchedWork?.program === program && matchedWork?.title === title;
          return (
            <Work
              key={`${programIndex}-${title.ko ?? title.en}-${titleIndex}`}
              number={workNumber}
              isMatched={isMatched}
              titleKo={title.ko}
              titleEn={title.en}
              variant={variant}
            />
          );
        });

        return (
          <section key={`program-${programIndex}`}>
            {composerHeader}
            <div className="mt-1 space-y-3">{works}</div>
          </section>
        );
      })}
    </div>
  );
}
