import type { Program } from "@classic-hub/shared/types/common";

interface ProgramMatchResult {
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

export default getMatchedProgram;
