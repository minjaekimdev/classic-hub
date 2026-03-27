import type { Program } from "@classic-hub/shared/types/common";

const getMatchGroup = (target: string, keyword: string) => {
  const keywordIdx = target.toLowerCase().indexOf(keyword.toLowerCase());
  if (keywordIdx !== -1) {
    const before = target.substring(0, keywordIdx);
    const match = target.substring(keywordIdx, keywordIdx + keyword.length);
    const after = target.substring(keywordIdx + keyword.length);
    return [before, match, after];
  }
  return null;
};

export const getProgramInfo = (program: Program[], keyword: string) => {
  // 키워드가 존재하지 않거나, program이 존재하지 않는다면 null 리턴
  if (!program || program.length === 0) {
    return null;
  }

  for (const item of program) {
    if (item.composerKo) {
      const matchGroup = getMatchGroup(item.composerKo, keyword);
      if (matchGroup) {
        return {
          composer: matchGroup,
          piece: item.workTitleKr[0] ?? null,
        };
      }
    }

    if (item.workTitleKr.length > 0) {
      const matchedPiece = item.workTitleKr.find((work) =>
        work.includes(keyword),
      );
      if (matchedPiece) {
        const matchGroup = getMatchGroup(matchedPiece, keyword);
        if (matchGroup) {
          return {
            composer: item.composerKo,
            piece: matchGroup,
          };
        }
      }
    }

    if (item.composerEn) {
      const matchGroup = getMatchGroup(item.composerEn, keyword);
      if (matchGroup) {
        console.log(`keyword: ${keyword}, matched: ${matchGroup}`);
        return {
          composer: matchGroup,
          piece: item.workTitleEn[0] ?? null,
        };
      }
    }

    if (item.workTitleEn.length > 0) {
      const matchedPiece = item.workTitleEn.find((work) =>
        work.toLowerCase().includes(keyword.toLowerCase()),
      );
      if (matchedPiece) {
        const matchGroup = getMatchGroup(matchedPiece, keyword);
        if (matchGroup) {
          return {
            composer: item.composerEn,
            piece: matchGroup,
          };
        }
      }
    }
  }

  // 아무것도 매칭되지 않았으면 null 반환
  return null;
};

export const getPieceCount = (programs: Program[]) => {
  let result = 0;
  for (const program of programs) {
    result += program.workTitleKr.length;
  }
  return result;
};
