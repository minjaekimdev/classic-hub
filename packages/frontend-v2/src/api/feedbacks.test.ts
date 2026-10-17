import { describe, expect, it } from "vitest";
import {
  buildProgramReportContent,
  buildServiceFeedbackContent,
} from "@/api/feedbacks";
import type { Concert } from "@/types/concert";

describe("buildServiceFeedbackContent", () => {
  it("주제와 만족도를 내용 앞에 유형 표기로 붙인다", () => {
    const content = buildServiceFeedbackContent({
      topic: "기능 제안 / 개선 요청",
      rating: "매우 만족",
      content: "아티스트별 모아보기가 있으면 좋겠어요. ",
    });
    expect(content).toBe(
      "[서비스 피드백] 주제: 기능 제안 / 개선 요청 / 만족도: 매우 만족\n\n아티스트별 모아보기가 있으면 좋겠어요.",
    );
  });
});

describe("buildProgramReportContent", () => {
  const concert = {
    id: "PF1",
    name: "테스트 콘서트",
    periodFrom: "2026.10.16",
    periodTo: "2026.10.17",
    venueName: "테스트홀",
    programs: [
      {
        composerKo: "라흐마니노프",
        composerEn: "Rachmaninoff",
        titles: [{ ko: "피아노 협주곡 2번", en: "Piano Concerto No. 2" }],
      },
    ],
  } as unknown as Concert;

  it("공연 식별 정보와 수정 요청 내용을 구조화한다", () => {
    const content = buildProgramReportContent({
      concert,
      details: "작품번호가 43번이어야 합니다.",
    });
    expect(content).toBe(
      [
        "[프로그램 오류 제보]",
        "공연: 테스트 콘서트 (PF1)",
        "기간: 2026.10.16 ~ 2026.10.17",
        "장소: 테스트홀",
        "등록된 프로그램: 피아노 협주곡 2번",
        "---",
        "작품번호가 43번이어야 합니다.",
      ].join("\n"),
    );
  });

  it("참고 링크가 있으면 포함한다", () => {
    const content = buildProgramReportContent({
      concert,
      details: "수정 요청",
      referenceUrl: "https://example.com/notice",
    });
    expect(content).toContain("참고 링크: https://example.com/notice");
  });
});
