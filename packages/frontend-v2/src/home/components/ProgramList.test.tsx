import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ProgramList from "@/home/components/ProgramList";
import type { ConcertProgram } from "@/types/concert";

const programs: ConcertProgram[] = [
  {
    composerKo: "리하르트 바그너",
    composerEn: "Richard Wagner",
    titles: [{ ko: "뉘른베르크의 마이스터징거 전주곡", en: "Die Meistersinger von Nürnberg" }],
  },
  {
    composerKo: "세르게이 라흐마니노프",
    composerEn: "Sergei Rachmaninoff",
    titles: [
      { ko: "피아노 협주곡 2번", en: "Piano Concerto No. 2" },
      { ko: "회화적 연습곡", en: "Études-Tableaux" },
    ],
  },
];

describe("ProgramList", () => {
  it("작곡가별로 곡 수와 함께 그룹화해 표기한다 (specs card-009, card-010)", () => {
    render(<ProgramList programs={programs} variant="flyout" />);
    expect(screen.getByText("리하르트 바그너")).toBeInTheDocument();
    expect(screen.getByText("Richard Wagner")).toBeInTheDocument();
    expect(screen.getByText("1곡")).toBeInTheDocument();
    expect(screen.getByText("2곡")).toBeInTheDocument();
    expect(screen.getByText("피아노 협주곡 2번")).toBeInTheDocument();
    expect(screen.getByText("Piano Concerto No. 2")).toBeInTheDocument();
  });

  it("작곡가가 없는 프로그램은 곡 목록만 표기한다 (specs card-007)", () => {
    render(
      <ProgramList
        programs={[{ composerKo: null, composerEn: null, titles: [{ ko: "곡명만", en: null }] }]}
        variant="sheet"
      />,
    );
    expect(screen.getByText("곡명만")).toBeInTheDocument();
    expect(screen.queryByText(/곡$/)).not.toBeInTheDocument();
  });
});
