import { describe, expect, it } from "vitest";
import { findMatchedProgramWork } from "@/lib/program";
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
