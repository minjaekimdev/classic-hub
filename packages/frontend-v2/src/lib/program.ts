/**
 * specs/home.md 구현 정책
 * - search-008: 검색어와 일치하는 작곡가/곡명을 프로그램 순서대로 탐색(대소문자·공백 무시)
 * - card-008/011/018: 프로그램 곡 수·작곡가·'작곡가 - 곡명' 제목 표기에 필요한 파생값 계산
 */
import type { ConcertProgram, ConcertProgramTitle } from "@/types/concert";

export interface MatchedProgramWork {
  program: ConcertProgram;
  title: ConcertProgramTitle;
}

const compact = (value: string): string => value.toLowerCase().replace(/\s+/g, "");

const joinWork = (composer: string | null, title: string | null): string | null =>
  composer && title ? `${composer} ${title}` : null;

/**
 * 검색어와 작곡가/곡명이 일치하는 곡을 찾는다 (specs search-008)
 * - 프로그램 순서대로 작곡가(한/영)와 곡명(한/영)을 비교하고, 첫 일치 항목을 반환한다
 * - DB 검색(search_target)은 작곡가+곡명이 이어진 텍스트로 매칭하므로, 결합 텍스트도 함께 검사해
 *   '브람스교향곡'처럼 필드 경계를 가로지르는 검색어가 카드 표시에서도 동일하게 일치하도록 한다
 * - 띄어쓰기와 대소문자는 무시한다
 * - 일치하는 곡이 없으면 null을 반환하며, 호출부는 기본 곡(첫 프로그램의 첫 곡)을 사용한다
 */
export const findMatchedProgramWork = (
  programs: ConcertProgram[],
  query: string,
): MatchedProgramWork | null => {
  const needle = compact(query.trim());
  if (!needle) return null;

  for (const program of programs) {
    for (const title of program.titles) {
      const targets = [
        program.composerKo,
        program.composerEn,
        title.ko,
        title.en,
        joinWork(program.composerKo, title.ko),
        joinWork(program.composerEn, title.en),
      ];
      const isMatch = targets.some((target) => target && compact(target).includes(needle));
      if (isMatch) {
        return { program, title };
      }
    }
  }
  return null;
};

/** 공연 카드(리스트형/앨범형) 프로그램 영역이 필요로 하는 파생값 묶음 */
export interface ProgramSummary {
  /** 프로그램 전체 곡 수 */
  totalCount: number;
  /** 메인 표기할 첫 곡 라벨 — '작곡가 - 곡명' 형식 (card-018), 프로그램이 없으면 null */
  firstTitleLabel: string | null;
  /** 메인 곡의 영문 제목 — 한글 제목이 있을 때만 보조 표기한다 */
  firstTitleEn: string | null;
  /** 메인 곡을 제외한 나머지 곡 수 — (외 N곡) 표기용 (card-008) */
  extraCount: number;
  /** 중복 없는 작곡가 목록 (card-011) */
  composers: string[];
}

/**
 * 카드 프로그램 영역에 표기할 파생값을 계산한다 (specs search-008, card-008/011/018)
 * - 검색어와 일치하는 곡이 있으면 해당 작품을 메인으로, 없으면 첫 프로그램의 첫 곡을 메인으로 한다
 */
export const getProgramSummary = (
  programs: ConcertProgram[],
  query: string,
): ProgramSummary => {
  const totalCount = programs.reduce((sum, program) => sum + program.titles.length, 0);
  const matchedWork = findMatchedProgramWork(programs, query);
  const featuredProgram = matchedWork?.program ?? programs[0];
  const featuredTitle = matchedWork?.title ?? featuredProgram?.titles[0];
  const firstTitleKo = featuredTitle?.ko ?? featuredTitle?.en ?? null;
  // '작곡가 - 곡명' 형식으로 표기 (specs card-018)
  const firstComposer = featuredProgram?.composerKo ?? featuredProgram?.composerEn ?? null;
  return {
    totalCount,
    firstTitleLabel:
      firstComposer && firstTitleKo ? `${firstComposer} - ${firstTitleKo}` : firstTitleKo,
    firstTitleEn: featuredTitle?.ko && featuredTitle.en ? featuredTitle.en : null,
    extraCount: Math.max(0, totalCount - 1),
    composers: programs
      .map((program) => program.composerKo ?? program.composerEn)
      .filter((composer): composer is string => composer !== null)
      .filter((composer, index, all) => all.indexOf(composer) === index),
  };
};
