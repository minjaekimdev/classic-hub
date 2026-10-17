/**
 * specs/home.md 구현 정책
 * - card-007: 작곡가 정보가 없는 프로그램은 곡 목록만 표기
 * - card-009/010: card-009 바텀시트 / card-010 팝오버에 렌더링되는 전체 프로그램 목록
 */
import type { ConcertProgram } from "@/types/concert";

interface ProgramListProps {
  programs: ConcertProgram[];
  /** "flyout": 데스크톱 호버 팝오버(좌측 보더 리스트) / "sheet": 모바일 바텀시트(카드 리스트) */
  variant: "flyout" | "sheet";
}

interface WorkProps {
  titleKo: string | null;
  titleEn: string | null;
  variant: "flyout" | "sheet";
}

function Work({ titleKo, titleEn, variant }: WorkProps) {
  const main = titleKo ?? titleEn;
  if (!main) return null;

  if (variant === "flyout") {
    return (
      <div className="space-y-0.5">
        <p className="font-serif text-xs font-medium text-primary">{main}</p>
        {titleKo && titleEn && (
          <p className="font-serif text-[11px] italic text-on-surface-variant/80">{titleEn}</p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-outline-variant/40 bg-surface-container-low space-y-1 p-4">
      <h4 className="font-serif text-program-title leading-snug text-primary">{main}</h4>
      {titleKo && titleEn && (
        <p className="text-body-sm font-normal italic tracking-wide text-on-surface-variant">
          {titleEn}
        </p>
      )}
    </div>
  );
}

/** 전체 연주 프로그램을 작곡가별로 묶어 표기한다 (specs card-009, card-010) */
export default function ProgramList({ programs, variant }: ProgramListProps) {
  return (
    <div className={variant === "flyout" ? "space-y-4" : "space-y-6"}>
      {programs.map((program, index) => {
        const composerKo = program.composerKo ?? program.composerEn;
        const works = (
          <>
            {program.titles.map((title, titleIndex) => (
              <Work
                key={`${title.ko ?? title.en}-${titleIndex}`}
                titleKo={title.ko}
                titleEn={title.en}
                variant={variant}
              />
            ))}
          </>
        );

        if (!composerKo) {
          // 작곡가 정보가 없는 프로그램은 곡 목록만 표기한다 (specs card-007)
          return (
            <section key={`program-${index}`}>
              {variant === "sheet" ? <div className="space-y-3">{works}</div> : works}
            </section>
          );
        }

        return (
          <section key={`program-${index}`} className="space-y-2">
            <div className="flex items-baseline justify-between gap-2">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
                <h4
                  className={
                    variant === "flyout"
                      ? "font-serif text-sm font-semibold tracking-wide text-primary"
                      : "font-serif text-headline-sm text-primary"
                  }
                >
                  {composerKo}
                </h4>
                {program.composerKo && program.composerEn && (
                  <span
                    className={
                      variant === "flyout"
                        ? "font-serif text-[11px] italic text-on-surface-variant/80"
                        : "font-label-caps tracking-wider text-secondary"
                    }
                  >
                    {program.composerEn}
                  </span>
                )}
              </div>
              <span className="font-label-caps text-on-surface-variant">
                {program.titles.length}곡
              </span>
            </div>
            {variant === "flyout" ? (
              <div className="space-y-3 border-l-2 border-outline-variant/30 pl-3">{works}</div>
            ) : (
              <div className="space-y-3">{works}</div>
            )}
          </section>
        );
      })}
    </div>
  );
}
