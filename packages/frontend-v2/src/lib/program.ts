/**
 * specs/home.md 구현 정책
 * - search-008: 검색어와 일치하는 작곡가/곡명을 프로그램 순서대로 탐색(대소문자·공백 무시)
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
