import { describe, it, expect, vi, beforeEach } from "vitest";
import sharp from "sharp";
import {
  createTransformPerformances,
  TransformPerformancesDeps,
} from "./transformPerformances";
import { splitLongImage } from "./program/splitLongImage";
import { PerformanceDetail } from "@/shared/types/kopis";
import { ProgramExtractionResponse } from "shared/types/gemini";

// ImageSplitError는 실제 데이터로 재현이 불가능하다.
// sanitize가 sharp로 재인코딩한 유효 JPEG를 split이 받기 때문에
// sharp.metadata()가 실패할 수 없다. 그래서 이 모듈만 파일 범위 mock으로 갈아끼우고,
// 기본 구현은 실제 함수로 위임한다(다른 시나리오는 전부 실제 동작으로 돌린다).
vi.mock("./program/splitLongImage", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("./program/splitLongImage")>();
  return { ...actual, splitLongImage: vi.fn(actual.splitLongImage) };
});

const realImage = () =>
  sharp({
    create: {
      width: 10,
      height: 10,
      channels: 3,
      background: { r: 255, g: 0, b: 0 },
    },
  })
    .png()
    .toBuffer();

const makeDetail = (
  id: string,
  overrides: Partial<PerformanceDetail> = {},
): PerformanceDetail =>
  ({
    mt20id: id,
    mt10id: "FC001431",
    prfnm: `공연-${id}`,
    prfpdfrom: "2026.01.01",
    prfpdto: "2026.06.30",
    fcltynm: "공연장",
    prfcast: "",
    prfcrew: "",
    prfruntime: "",
    prfage: "",
    entrpsnmP: "",
    entrpsnmA: "",
    entrpsnmH: "",
    entrpsnmS: "",
    pcseguidance: "",
    poster: "http://poster",
    sty: "",
    area: "서울",
    genrenm: "연극",
    prfstate: "공연중",
    openrun: "N" as const,
    visit: "N" as const,
    child: "N" as const,
    daehakro: "N" as const,
    festival: "N" as const,
    musicallicense: "N" as const,
    musicalcreate: "N" as const,
    updatedate: "2026-07-22",
    relates: { relate: { relatenm: "예매처", relateurl: "http://booking" } },
    styurls: { styurl: ["http://detail-1"] },
    dtguidance: "",
    ...overrides,
  }) as unknown as PerformanceDetail;

const makeDeps = (
  overrides: Partial<TransformPerformancesDeps> = {},
): TransformPerformancesDeps => ({
  imageFetcher: vi.fn().mockImplementation(() => realImage()),
  getProgramText: vi.fn().mockResolvedValue("추출된 프로그램 텍스트"),
  getProgramJSON: vi
    .fn()
    .mockResolvedValue({ program: "프로그램" } as unknown as ProgramExtractionResponse),
  uploadPosterToStorage: vi.fn().mockResolvedValue("https://storage/poster.webp"),
  log: { debug: vi.fn(), info: vi.fn(), error: vi.fn() },
  ...overrides,
});

const run = (deps: TransformPerformancesDeps, detail: PerformanceDetail) =>
  createTransformPerformances(deps)(detail);

describe("transformPerformances 에러 분류 테스트", () => {
  beforeEach(() => {
    vi.mocked(splitLongImage).mockClear();
  });

  it("모든 단계가 성공하면 error: null과 toDbPerformance로 만든 데이터를 반환한다", async () => {
    const detail = makeDetail("PF1", {
      poster: "http://poster",
      styurls: { styurl: "http://detail" },
    });
    const imageFetcher = vi
      .fn()
      .mockImplementation((url: string) => realImage());

    const deps = makeDeps({ imageFetcher });
    const result = await run(deps, detail);

    expect(result.error).toBeNull();
    expect(result.data).not.toBeNull();
    expect(result.data!.performance_id).toBe("PF1");
    expect(result.data!.poster).toBe("https://storage/poster.webp");
    expect(result.data!.detail_image).toEqual(["http://detail"]);
    expect(imageFetcher).toHaveBeenCalledTimes(2);
    expect(deps.uploadPosterToStorage).toHaveBeenCalledWith(
      "PF1",
      expect.any(Buffer),
    );
    expect(deps.log.error).not.toHaveBeenCalled();
  });

  it("이미지 페칭이 실패하면 실패 기록(attempts, failedAt)과 함께 ImageFetchError를 반환한다", async () => {
    const deps = makeDeps({
      imageFetcher: vi.fn().mockRejectedValue(new Error("fetch fail")),
    });

    const result = await run(deps, makeDetail("PF1"));

    expect(result).toEqual({
      id: "PF1",
      error: "ImageFetchError",
      data: null,
      attempts: 1,
      failedAt: expect.any(String),
    });
  });

  it("상세 이미지 정리(sanitize)가 실패하면 ImageFetchError를 반환한다", async () => {
    const deps = makeDeps({
      imageFetcher: vi.fn().mockResolvedValue(Buffer.from("not an image")),
    });

    const result = await run(deps, makeDetail("PF1"));

    expect(result.id).toBe("PF1");
    expect(result.error).toBe("ImageFetchError");
    expect(result.data).toBeNull();
  });

  it("이미지 분할이 실패하면 ImageSplitError를 반환한다", async () => {
    vi.mocked(splitLongImage).mockRejectedValueOnce(new Error("split fail"));

    const result = await run(makeDeps(), makeDetail("PF1"));

    expect(result.id).toBe("PF1");
    expect(result.error).toBe("ImageSplitError");
    expect(result.data).toBeNull();
  });

  it("OCR 텍스트 추출이 실패하면 OCRError를 반환한다", async () => {
    const deps = makeDeps({
      getProgramText: vi.fn().mockRejectedValue(new Error("ocr fail")),
    });

    const result = await run(deps, makeDetail("PF1"));

    expect(result.id).toBe("PF1");
    expect(result.error).toBe("OCRError");
    expect(result.data).toBeNull();
  });

  it("OCR 텍스트가 비어 있으면 OCRError를 반환한다", async () => {
    const deps = makeDeps({
      getProgramText: vi.fn().mockResolvedValue(""),
    });

    const result = await run(deps, makeDetail("PF1"));

    expect(result.id).toBe("PF1");
    expect(result.error).toBe("OCRError");
    expect(result.data).toBeNull();
  });

  it("sty 필드가 있으면 sty 텍스트와 OCR 텍스트를 결합해 Gemini에 넘긴다", async () => {
    const getProgramJSON = vi
      .fn()
      .mockResolvedValue({ program: "프로그램" } as unknown as ProgramExtractionResponse);

    const deps = makeDeps({ getProgramJSON });
    await run(deps, makeDetail("PF1", { sty: "공연 소개" }));

    const [programText] = getProgramJSON.mock.calls[0];
    expect(programText).toContain("공연 소개");
    expect(programText).toContain("추출된 프로그램 텍스트");
  });

  it("Gemini 변환이 실패하면 GeminiError를 반환한다", async () => {
    const deps = makeDeps({
      getProgramJSON: vi.fn().mockRejectedValue(new Error("gemini fail")),
    });

    const result = await run(deps, makeDetail("PF1"));

    expect(result.id).toBe("PF1");
    expect(result.error).toBe("GeminiError");
    expect(result.data).toBeNull();
  });

  it("포스터 압축이 실패하면 SharpError를 반환한다", async () => {
    const imageFetcher = vi.fn().mockImplementation((url: string) =>
      url === "http://poster" ? Buffer.from("broken poster") : realImage(),
    );

    const deps = makeDeps({ imageFetcher });
    const result = await run(deps, makeDetail("PF1"));

    expect(result.id).toBe("PF1");
    expect(result.error).toBe("SharpError");
    expect(result.data).toBeNull();
  });

  it("포스터 업로드가 실패하면 StorageError를 반환한다", async () => {
    const deps = makeDeps({
      uploadPosterToStorage: vi
        .fn()
        .mockRejectedValue(new Error("upload fail")),
    });

    const result = await run(deps, makeDetail("PF1"));

    expect(result.id).toBe("PF1");
    expect(result.error).toBe("StorageError");
    expect(result.data).toBeNull();
  });
});
