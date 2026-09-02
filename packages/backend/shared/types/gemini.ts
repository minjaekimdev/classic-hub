import { z } from "zod";

/**
 * 프로그램 추출 응답의 단일 진실 공급원(Single Source of Truth)
 *
 * - TypeScript 타입: z.infer로 이 스키마에서 파생한다.
 * - Gemini에 전달할 responseJsonSchema: z.toJSONSchema로 이 스키마에서 생성한다. (getProgramJSON 참고)
 * - 따라서 스키마-타입-프롬프트 제약 간 불일치가 구조적으로 발생할 수 없다.
 */
export const programItemSchema = z.object({
  /** 작곡가(또는 편곡자)의 한국어 전체 성명. 식별 불가 시 null */
  composerKo: z
    .string()
    .nullable()
    .describe("작곡가 또는 편곡자의 한국어 전체 성명"),
  /** 작곡가(또는 편곡자)의 영문 전체 성명. 식별 불가 시 null */
  composerEn: z
    .string()
    .nullable()
    .describe("Full name of the composer in English"),
  /** 연주 곡목의 한국어 제목 리스트 (악장 제외). 곡명 미상 시 빈 배열 */
  workTitleKr: z
    .array(z.string())
    .describe("연주 곡목의 한국어 제목 리스트 (악장 제외)"),
  /** 연주 곡목의 영문 제목 리스트 (악장 제외). 곡명 미상 시 빈 배열 */
  workTitleEn: z
    .array(z.string())
    .describe("List of work titles in English (Excluding movements)"),
});

// programItemSchema로부터 타입 추출
export type ProgramItem = z.infer<typeof programItemSchema>;

/**
 * 최종 응답 형식: 작곡가 객체들의 배열
 */
export const programExtractionSchema = z
  .array(programItemSchema)
  .describe("작곡가별 연주 곡목 리스트")
  // 프롬프트 규칙 7: composer 둘 다 null + 곡명 배열 둘 다 빈 배열인 항목은 없어야 한다.
  // JSON Schema로는 표현할 수 없는 규칙이라 런타임 검증에서만 수행된다.
  .refine(
    (items) =>
      items.every(
        (item) =>
          item.composerKo !== null ||
          item.composerEn !== null ||
          item.workTitleKr.length > 0 ||
          item.workTitleEn.length > 0,
      ),
    {
      message:
        "composerKo, composerEn이 모두 null이고 workTitleKr, workTitleEn이 모두 빈 배열인 항목이 있습니다.",
    },
  );

export type ProgramExtractionResponse = z.infer<typeof programExtractionSchema>;
