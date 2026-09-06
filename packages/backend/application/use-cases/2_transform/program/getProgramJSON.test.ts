import { describe, it, expect, vi } from "vitest";
import { APIError } from "shared/utils/error";
import {
  createGetProgramJSON,
  GetProgramJSONDeps,
} from "./getProgramJSON";

// 헬퍼: 테스트에서의 deps 스텁을 쉽게 만든다. 필요한 부분만 overrides로 교체.
const makeDeps = (
  overrides: Partial<GetProgramJSONDeps> = {},
): GetProgramJSONDeps => ({
  generateContent: vi.fn(),
  log: { info: vi.fn() },
  ...overrides,
});

// Gemini 응답 text에 담길 정상 JSON 문자열 (실제 응답 스키마와 동일한 필드 구성)
const validJSONText = JSON.stringify([
  {
    composerKo: "루드비히 반 베토벤",
    composerEn: "Ludwig van Beethoven",
    workTitleKr: ["교향곡 제5번"],
    workTitleEn: ["Symphony No. 5"],
  },
]);

describe("createGetProgramJSON", () => {
  // 시나리오 1: 정상 흐름 - JSON 문자열을 파싱해 객체로 반환
  it("Gemini 응답 텍스트를 파싱하여 객체로 반환한다", async () => {
    const generateContent = vi.fn().mockResolvedValue({
      text: validJSONText,
      usageMetadata: { totalTokenCount: 100 },
    });
    const getProgramJSON = createGetProgramJSON(makeDeps({ generateContent }));

    const result = await getProgramJSON("베토벤 교향곡 제5번");

    expect(result).toEqual([
      {
        composerKo: "루드비히 반 베토벤",
        composerEn: "Ludwig van Beethoven",
        workTitleKr: ["교향곡 제5번"],
        workTitleEn: ["Symphony No. 5"],
      },
    ]);
  });

  // 시나리오 2: 요청 조립 - 프로그램 텍스트가 프롬프트에 들어가고, JSON 응답 모드를 요청하는가
  // (INSTRUCTION 전문이나 model 이름까지 검증하지 않는다. 프롬프트 튜닝은 자주 바뀌는 부분이라
  //  테스트에 묶어두면 사소한 수정마다 테스트가 깨진다. 하위 계층이 깨지는 것만 잠근다.)
  it("프로그램 텍스트를 프롬프트에 포함하고 JSON 응답 모드로 요청한다", async () => {
    const generateContent = vi.fn().mockResolvedValue({ text: validJSONText });
    const getProgramJSON = createGetProgramJSON(makeDeps({ generateContent }));

    await getProgramJSON("베토벤 교향곡 제5번");

    expect(generateContent).toHaveBeenCalledWith(
      expect.objectContaining({
        contents: expect.stringContaining("베토벤 교향곡 제5번"),
        config: expect.objectContaining({
          responseMimeType: "application/json",
        }),
      }),
    );
  });

  // 시나리오 3: 빈 텍스트 응답 방어 (LLM이 빈 문자열을 반환하는 경우)
  it("Gemini 응답 텍스트가 비어 있으면 APIError를 던진다", async () => {
    const getProgramJSON = createGetProgramJSON(
      makeDeps({ generateContent: vi.fn().mockResolvedValue({ text: "" }) }),
    );

    // TODO: 실제 Gemini 호출 시 빈 문자열을 반환하는 경우 어떻게 처리할지 정책 필요
    await expect(getProgramJSON("프로그램 텍스트")).rejects.toThrow(APIError);
  });

  // 시나리오 4: 응답 객체 자체가 없는 경우 방어
  it("Gemini 응답 객체가 없으면 APIError를 던진다", async () => {
    const getProgramJSON = createGetProgramJSON(
      makeDeps({ generateContent: vi.fn().mockResolvedValue(undefined) }),
    );

    await expect(getProgramJSON("프로그램 텍스트")).rejects.toThrow(APIError);
  });

  // 시나리오 5: 깨진 JSON 방어
  // LLM 출력이 maxOutputTokens로 잘리는 등의 이유로 JSON이 깨질 수 있다.
  // 이 함수는 에러를 감싸지 않고 그대로 던진다(에러 정책은 상위 오케스트레이터 담당).
  // 이 계약을 고정해둔다.
  it("응답이 깨진 JSON이면 파싱 에러를 그대로 전파한다", async () => {
    const getProgramJSON = createGetProgramJSON(
      makeDeps({
        generateContent: vi
          .fn()
          .mockResolvedValue({ text: '{"composerKo": ' }),
      }),
    );

    await expect(getProgramJSON("프로그램 텍스트")).rejects.toThrow();
  });

  // 시나리오 6: 관측성 - 토큰 사용량 로그에 usageMetadata가 전달되는가
  it("토큰 사용량을 로그로 남긴다", async () => {
    const usageMetadata = { totalTokenCount: 100 };
    const log = { info: vi.fn() };
    const getProgramJSON = createGetProgramJSON(
      makeDeps({
        generateContent: vi
          .fn()
          .mockResolvedValue({ text: validJSONText, usageMetadata }),
        log,
      }),
    );

    await getProgramJSON("프로그램 텍스트");

    expect(log.info).toHaveBeenCalledWith(
      "Gemini 프로그램 분석 완료",
      expect.objectContaining({ usage: usageMetadata }),
    );
  });

  // 시나리오 7: 스키마 불일치 방어 - 필수 필드 누락
  // responseJsonSchema는 모델에 대한 요청일 뿐 보장이 아니므로, 실제 응답을 런타임에 검증한다.
  it("응답이 스키마와 일치하지 않으면(필수 필드 누락) APIError를 던진다", async () => {
    const invalidJSONText = JSON.stringify([{ composerKo: "베토벤" }]);
    const getProgramJSON = createGetProgramJSON(
      makeDeps({
        generateContent: vi.fn().mockResolvedValue({ text: invalidJSONText }),
      }),
    );

    await expect(getProgramJSON("프로그램 텍스트")).rejects.toThrow(APIError);
  });

  // 시나리오 8: 스키마 불일치 방어 - 필드 타입 불일치
  it("필드 타입이 스키마와 다르면 APIError를 던진다", async () => {
    const invalidJSONText = JSON.stringify([
      {
        composerKo: "루드비히 반 베토벤",
        composerEn: "Ludwig van Beethoven",
        workTitleKr: "교향곡 제5번", // 배열이 아닌 문자열
        workTitleEn: ["Symphony No. 5"],
      },
    ]);
    const getProgramJSON = createGetProgramJSON(
      makeDeps({
        generateContent: vi.fn().mockResolvedValue({ text: invalidJSONText }),
      }),
    );

    await expect(getProgramJSON("프로그램 텍스트")).rejects.toThrow(APIError);
  });

  // 시나리오 9: 프롬프트 규칙 7 위반 - 네 필드가 모두 '없음'인 항목
  // (JSON Schema로는 표현할 수 없어 zod refine으로만 검증하는 규칙)
  it("composer와 workTitle이 모두 비어 있는 항목이 있으면 APIError를 던진다", async () => {
    const invalidJSONText = JSON.stringify([
      {
        composerKo: null,
        composerEn: null,
        workTitleKr: [],
        workTitleEn: [],
      },
    ]);
    const getProgramJSON = createGetProgramJSON(
      makeDeps({
        generateContent: vi.fn().mockResolvedValue({ text: invalidJSONText }),
      }),
    );

    await expect(getProgramJSON("프로그램 텍스트")).rejects.toThrow(APIError);
  });

  // 시나리오 10: 스키마에 없는 추가 필드는 zod 기본 동작에 따라 제거된다 (계약 고정)
  it("스키마에 없는 추가 필드는 제거하고 반환한다", async () => {
    const jsonWithExtraField = JSON.stringify([
      {
        composerKo: "루드비히 반 베토벤",
        composerEn: "Ludwig van Beethoven",
        workTitleKr: ["교향곡 제5번"],
        workTitleEn: ["Symphony No. 5"],
        instrument: "관현악",
      },
    ]);
    const getProgramJSON = createGetProgramJSON(
      makeDeps({
        generateContent: vi.fn().mockResolvedValue({ text: jsonWithExtraField }),
      }),
    );

    const result = await getProgramJSON("프로그램 텍스트");

    expect(result).toEqual([
      {
        composerKo: "루드비히 반 베토벤",
        composerEn: "Ludwig van Beethoven",
        workTitleKr: ["교향곡 제5번"],
        workTitleEn: ["Symphony No. 5"],
      },
    ]);
  });
});
