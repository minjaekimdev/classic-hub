import { describe, it, expect } from "vitest";
import { getProgramInfo } from "./utils";

const mockProgram = [
  {
    composerKo: "프레드릭 쇼팽",
    composerEn: "Fredric Chopin",
    workTitleKr: ["녹턴"],
    workTitleEn: ["Nocturne"],
  },
  {
    composerKo: "프란츠 리스트",
    composerEn: "Franz Liszt",
    workTitleKr: ["헝가리안 랩소디"],
    workTitleEn: ["Hungarian Rhapsody"],
  },
];

describe("getProgramInfo 단위 테스트", () => {
  it("키워드가 한글 작곡가에 포함되는 경우", () => {
    const matchedProgam = getProgramInfo(mockProgram, "쇼팽");
    expect(matchedProgam).toEqual({
      composer: ["프레드릭 ", "쇼팽", ""],
      piece: "녹턴",
    });
  });
  it("키워드가 한글 곡명에 포함되는 경우", () => {
    const matchedProgam = getProgramInfo(mockProgram, "녹턴");
    expect(matchedProgam).toEqual({
      composer: "프레드릭 쇼팽",
      piece: ["", "녹턴", ""],
    });
  });
  it("키워드가 영문 작곡가에 포함되는 경우", () => {
    const matchedProgam = getProgramInfo(mockProgram, "Chopin");
    expect(matchedProgam).toEqual({
      composer: ["Fredric ", "Chopin", ""],
      piece: "Nocturne",
    });

    // 소문자로 검색한 경우
    const matchedProgramLower = getProgramInfo(mockProgram, "chopin");
        expect(matchedProgramLower).toEqual({
      composer: ["Fredric ", "Chopin", ""],
      piece: "Nocturne",
    });
  });
  it("키워드가 영문 곡명에 포함되는 경우", () => {
    const matchedProgam = getProgramInfo(mockProgram, "Rhapsody");
    expect(matchedProgam).toEqual({
      composer: "Franz Liszt",
      piece: ["Hungarian ", "Rhapsody", ""],
    });

    // 소문자로 검색한 경우
    const matchedProgamLower = getProgramInfo(mockProgram, "rhapsody");
    expect(matchedProgamLower).toEqual({
      composer: "Franz Liszt",
      piece: ["Hungarian ", "Rhapsody", ""],
    });
  });
});
