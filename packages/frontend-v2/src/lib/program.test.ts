import { describe, expect, it } from "vitest";
import { findMatchedProgramWork, getProgramSummary } from "@/lib/program";
import type { ConcertProgram } from "@/types/concert";

const programs: ConcertProgram[] = [
  {
    composerKo: "세르게이 라흐마니노프",
    composerEn: "Sergei Rachmaninoff",
    titles: [
      { ko: "피아노 협주곡 2번", en: "Piano Concerto No. 2" },
      { ko: "녹턴", en: "Nocturne" },
    ],
  },
  {
    composerKo: "요하네스 브람스",
    composerEn: "Johannes Brahms",
    titles: [{ ko: "헝가리안 댄스", en: "Hungarian Dances" }],
  },
];

describe("findMatchedProgramWork (specs search-008)", () => {
  it("작곡가와 일치하면 해당 프로그램의 곡을 반환한다", () => {
    const matched = findMatchedProgramWork(programs, "라흐마니노프");
    expect(matched?.program.composerKo).toBe("세르게이 라흐마니노프");
    expect(matched?.title.ko).toBe("피아노 협주곡 2번");
  });

  it("곡명과 일치하면 해당 곡을 반환한다", () => {
    const matched = findMatchedProgramWork(programs, "녹턴");
    expect(matched?.program.composerKo).toBe("세르게이 라흐마니노프");
    expect(matched?.title.ko).toBe("녹턴");
  });

  it("부분 일치도 찾는다 (곡명 일부)", () => {
    const matched = findMatchedProgramWork(programs, "헝가리안");
    expect(matched?.title.ko).toBe("헝가리안 댄스");
  });

  it("영문 곡명은 대소문자 없이 일치시킨다", () => {
    const matched = findMatchedProgramWork(programs, "nocturne");
    expect(matched?.title.ko).toBe("녹턴");
  });

  it("띄어쓰기 없이 붙여 쓴 검색어로도 일치시킨다", () => {
    const matched = findMatchedProgramWork(programs, "피아노협주곡");
    expect(matched?.title.ko).toBe("피아노 협주곡 2번");
  });

  it("작곡가명+곡명을 붙여 쓴 한글 검색어도 필드 경계를 가로질러 일치시킨다 (DB 검색과 동일)", () => {
    const matched = findMatchedProgramWork(programs, "브람스헝가리안");
    expect(matched?.program.composerKo).toBe("요하네스 브람스");
    expect(matched?.title.ko).toBe("헝가리안 댄스");
  });

  it("작곡가명+곡명을 붙여 쓴 영문 검색어도 일치시킨다", () => {
    const matched = findMatchedProgramWork(programs, "brahmshungariandances");
    expect(matched?.title.ko).toBe("헝가리안 댄스");
  });

  it("일치하는 곡이 없으면 null을 반환한다", () => {
    expect(findMatchedProgramWork(programs, "차이콥스키")).toBeNull();
  });

  it("빈 검색어는 null을 반환한다", () => {
    expect(findMatchedProgramWork(programs, "  ")).toBeNull();
    expect(findMatchedProgramWork(programs, "")).toBeNull();
  });
});

describe("getProgramSummary (specs search-008, card-008/011/018)", () => {
  it("곡 수와 (외 N곡)용 나머지 곡 수를 계산한다 (specs card-008)", () => {
    const summary = getProgramSummary(programs, "");
    expect(summary.totalCount).toBe(3);
    expect(summary.extraCount).toBe(2);
  });

  it("메인 곡 라벨은 '작곡가 - 곡명' 형식이다 (specs card-018)", () => {
    const summary = getProgramSummary(programs, "");
    expect(summary.firstTitleLabel).toBe("세르게이 라흐마니노프 - 피아노 협주곡 2번");
    expect(summary.firstTitleEn).toBe("Piano Concerto No. 2");
  });

  it("검색어와 일치하는 곡을 메인으로 계산한다 (specs search-008)", () => {
    const summary = getProgramSummary(programs, "헝가리안");
    expect(summary.firstTitleLabel).toBe("요하네스 브람스 - 헝가리안 댄스");
  });

  it("작곡가가 없는 곡은 곡명만 라벨로 계산한다 (specs card-018)", () => {
    const summary = getProgramSummary(
      [{ composerKo: null, composerEn: null, titles: [{ ko: "곡명만 있는 곡", en: null }] }],
      "",
    );
    expect(summary.firstTitleLabel).toBe("곡명만 있는 곡");
    expect(summary.firstTitleEn).toBeNull();
  });

  it("작곡가 목록은 중복 없이 계산한다 (specs card-011)", () => {
    const summary = getProgramSummary(
      [
        {
          composerKo: "라흐마니노프",
          composerEn: null,
          titles: [{ ko: "곡1", en: null }],
        },
        {
          composerKo: "라흐마니노프",
          composerEn: null,
          titles: [{ ko: "곡2", en: null }],
        },
      ],
      "",
    );
    expect(summary.composers).toEqual(["라흐마니노프"]);
  });

  it("프로그램이 없으면 메인 라벨은 null이고 곡 수는 0이다 (specs card-007)", () => {
    const summary = getProgramSummary([], "");
    expect(summary.totalCount).toBe(0);
    expect(summary.extraCount).toBe(0);
    expect(summary.firstTitleLabel).toBeNull();
    expect(summary.composers).toEqual([]);
  });
});
