import { describe, it, expect, vi, beforeEach } from "vitest";
import processPerformance from "./processPerformance";

// 1. 모든 의존성 모킹
vi.mock("@/application/use-cases/kopis/getPerformanceDetailArray", () => ({
  getPerformanceDetail: vi.fn(),
  toMappedPerformanceDetail: vi.fn(),
}));
vi.mock("@/application/use-cases/kopis/getImageBuffer", () => ({ default: vi.fn() }));
vi.mock("@/application/use-cases/vision/getProgramText", () => ({ default: vi.fn() }));
vi.mock("@/application/use-cases/gemini/getProgramJSON", () => ({ default: vi.fn() }));
vi.mock("@/application/use-cases/images/optimzeAndUpload", () => ({ default: vi.fn() }));

import { getPerformanceDetail, toMappedPerformanceDetail } from "@/application/use-cases/kopis/getPerformanceDetailArray";
import getImageBuffer from "@/application/use-cases/kopis/getImageBuffer";
import getProgramText from "@/application/use-cases/vision/getProgramText";
import getProgramJSON from "@/application/use-cases/gemini/getProgramJSON";
import optimizeAndUpload from "@/application/use-cases/images/optimzeAndUpload";

describe("processPerformance", () => {
  const mockId = "PF123456";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("✅ 모든 단계가 성공하면 가공된 데이터를 반환해야 한다", async () => {
    vi.mocked(getPerformanceDetail).mockResolvedValue({ id: mockId, poster: "url", styurls: { styurl: [] }, sty: "텍스트" } as any);
    vi.mocked(getImageBuffer).mockResolvedValue({ posterBuffer: Buffer.from(""), detailBuffers: [] } as any);
    vi.mocked(getProgramJSON).mockResolvedValue({ program: "json" } as any);
    vi.mocked(optimizeAndUpload).mockResolvedValue({ storagePosterUrl: "url", storageDetailUrls: [] } as any);
    vi.mocked(toMappedPerformanceDetail).mockReturnValue("FINAL_DATA" as any);

    const result = await processPerformance(mockId);
    expect(result.error).toBeNull();
    expect(result.data).toBe("FINAL_DATA");
  });

  it("❌ KOPIS 상세 정보 페칭 실패 시 PerformanceFetchError를 반환해야 한다", async () => {
    vi.mocked(getPerformanceDetail).mockResolvedValue(null);
    const result = await processPerformance(mockId);
    expect(result.error).toBe("PerformanceFetchError");
  });

  it("❌ 이미지 버퍼 획득 실패 시 ImageFetchError를 반환해야 한다", async () => {
    vi.mocked(getPerformanceDetail).mockResolvedValue({ poster: "url", styurls: { styurl: [] } } as any);
    vi.mocked(getImageBuffer).mockResolvedValue(null); // 수정됨!
    const result = await processPerformance(mockId);
    expect(result.error).toBe("ImageFetchError");
  });

  it("❌ sty 필드가 없고 OCR 추출도 실패하면 OCRError를 반환해야 한다", async () => {
    vi.mocked(getPerformanceDetail).mockResolvedValue({ poster: "url", styurls: { styurl: [] }, sty: "" } as any);
    vi.mocked(getImageBuffer).mockResolvedValue({ posterBuffer: Buffer.from(""), detailBuffers: [] } as any);
    vi.mocked(getProgramText).mockResolvedValue(null); // 수정됨!
    const result = await processPerformance(mockId);
    expect(result.error).toBe("OCRError");
  });

  it("❌ Gemini API 변환 실패 시 GeminiError를 반환해야 한다", async () => {
    vi.mocked(getPerformanceDetail).mockResolvedValue({ poster: "url", styurls: { styurl: [] }, sty: "텍스트" } as any);
    vi.mocked(getImageBuffer).mockResolvedValue({ posterBuffer: Buffer.from(""), detailBuffers: [] } as any);
    vi.mocked(getProgramJSON).mockResolvedValue(null); // 수정됨!
    const result = await processPerformance(mockId);
    expect(result.error).toBe("GeminiError");
  });

  it("❌ 이미지 업로드(Supabase) 실패 시 ImageProcessError를 반환해야 한다", async () => {
    vi.mocked(getPerformanceDetail).mockResolvedValue({ poster: "url", styurls: { styurl: [] }, sty: "텍스트" } as any);
    vi.mocked(getImageBuffer).mockResolvedValue({ posterBuffer: Buffer.from(""), detailBuffers: [] } as any);
    vi.mocked(getProgramJSON).mockResolvedValue({} as any);
    vi.mocked(optimizeAndUpload).mockResolvedValue(null); // 수정됨!
    const result = await processPerformance(mockId);
    expect(result.error).toBe("ImageProcessError");
  });

  it("💡 sty 필드가 존재하면 OCR(getProgramText)을 호출하지 않아야 한다", async () => {
    vi.mocked(getPerformanceDetail).mockResolvedValue({ poster: "url", styurls: { styurl: [] }, sty: "텍스트 있음" } as any);
    vi.mocked(getImageBuffer).mockResolvedValue({ posterBuffer: Buffer.from(""), detailBuffers: [] } as any);
    vi.mocked(getProgramJSON).mockResolvedValue({} as any);
    vi.mocked(optimizeAndUpload).mockResolvedValue({ storagePosterUrl: "", storageDetailUrls: [] } as any);

    await processPerformance(mockId);
    expect(getProgramText).not.toHaveBeenCalled();
  });
});