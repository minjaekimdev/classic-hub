import { describe, it, expect, vi } from "vitest";
import {
  createGetPerformanceImageBuffers,
  GetPerformanceImageBuffersDeps,
} from "./getPerformanceImageBuffers";

// 헬퍼: 테스트에서의 deps 스텁을 쉽게 만든다. 필요한 부분만 overrides로 교체.
const makeDeps = (
  overrides: Partial<GetPerformanceImageBuffersDeps> = {},
): GetPerformanceImageBuffersDeps => ({
  imageFetcher: vi.fn(),
  log: { error: vi.fn() },
  ...overrides,
});

// 헬퍼: Buffer 스텁 생성
const makeBuffer = (mark: string) => Buffer.from(mark);

describe("getPerformanceImageBuffers 비즈니스 로직 테스트", () => {
  // 시나리오 1: 정상 흐름 - 포스터 + 상세 이미지 모두 존재
  it("포스터와 상세 이미지 url이 모두 있으면 각각 버퍼를 다운로드하여 반환해야 한다", async () => {
    const imageFetcher = vi
      .fn()
      .mockResolvedValueOnce(makeBuffer("poster")) // 포스터
      .mockResolvedValueOnce(makeBuffer("detail1")) // 상세1
      .mockResolvedValueOnce(makeBuffer("detail2")); // 상세2

    const getPerformanceImageBuffers = createGetPerformanceImageBuffers(
      makeDeps({ imageFetcher }),
    );
    const result = await getPerformanceImageBuffers({
      id: "ID_1",
      posterUrl: "http://poster",
      detailImageUrls: ["http://d1", "http://d2"],
    });

    expect(result).toEqual({
      id: "ID_1",
      posterBuffer: makeBuffer("poster"),
      detailImageBuffers: [makeBuffer("detail1"), makeBuffer("detail2")],
    });
    expect(imageFetcher).toHaveBeenCalledTimes(3);
  });

  // 시나리오 2: 포스터 url이 없음
  it("posterUrl이 없으면 포스터 다운로드는 생략하고 posterBuffer를 null로 반환해야 한다", async () => {
    const imageFetcher = vi.fn().mockResolvedValue(makeBuffer("detail"));

    const getPerformanceImageBuffers = createGetPerformanceImageBuffers(
      makeDeps({ imageFetcher }),
    );
    const result = await getPerformanceImageBuffers({
      id: "ID_1",
      posterUrl: "",
      detailImageUrls: ["http://d1"],
    });

    expect(result).toEqual({
      id: "ID_1",
      posterBuffer: null,
      detailImageBuffers: [makeBuffer("detail")],
    });
    expect(imageFetcher).toHaveBeenCalledTimes(1); // 상세 이미지 1회만
  });

  // 시나리오 3: 상세 이미지가 비어있음
  it("detailImageUrls가 빈 배열이면 detailImageBuffers도 빈 배열이어야 한다", async () => {
    const imageFetcher = vi.fn().mockResolvedValue(makeBuffer("poster"));

    const getPerformanceImageBuffers = createGetPerformanceImageBuffers(
      makeDeps({ imageFetcher }),
    );
    const result = await getPerformanceImageBuffers({
      id: "ID_1",
      posterUrl: "http://poster",
      detailImageUrls: [],
    });

    expect(result).toEqual({
      id: "ID_1",
      posterBuffer: makeBuffer("poster"),
      detailImageBuffers: [],
    });
    expect(imageFetcher).toHaveBeenCalledTimes(1); // 포스터만
  });

  // 시나리오 4: imageFetcher 에러 시 null 반환 + 에러 로깅
  it("다운로드 중 에러가 발생하면 null을 반환하고 에러 로그를 남겨야 한다", async () => {
    const imageFetcher = vi.fn().mockRejectedValue(new Error("fetch fail"));
    const log = { error: vi.fn() };

    const getPerformanceImageBuffers = createGetPerformanceImageBuffers(
      makeDeps({ imageFetcher, log }),
    );
    const result = await getPerformanceImageBuffers({
      id: "ID_1",
      posterUrl: "http://poster",
      detailImageUrls: ["http://d1"],
    });

    expect(result).toBeNull();
    expect(log.error).toHaveBeenCalledWith(
      expect.stringContaining("[IMAGE_FAIL] 이미지 다운로드 실패 (ID: ID_1)"),
    );
  });

  // 시나리오 5: 상세 이미지 중 일부 실패해도 전체는 null
  it("상세 이미지 중 하나라도 실패하면 catch로 빠져 null을 반환해야 한다", async () => {
    const imageFetcher = vi
      .fn()
      .mockResolvedValueOnce(makeBuffer("poster"))
      .mockRejectedValueOnce(new Error("detail fail")); // 상세1 실패

    const getPerformanceImageBuffers = createGetPerformanceImageBuffers(
      makeDeps({ imageFetcher }),
    );
    const result = await getPerformanceImageBuffers({
      id: "ID_1",
      posterUrl: "http://poster",
      detailImageUrls: ["http://d1"],
    });

    expect(result).toBeNull();
  });

  // 시나리오 6: imageFetcher에 메시지가 함께 전달되는지 확인
  it("imageFetcher 호출 시 실패 메시지를 함께 전달해야 한다", async () => {
    const imageFetcher = vi.fn().mockResolvedValue(makeBuffer("buf"));

    const getPerformanceImageBuffers = createGetPerformanceImageBuffers(
      makeDeps({ imageFetcher }),
    );
    await getPerformanceImageBuffers({
      id: "ID_9",
      posterUrl: "http://poster",
      detailImageUrls: ["http://d1"],
    });

    expect(imageFetcher).toHaveBeenCalledWith(
      "http://poster",
      expect.stringContaining("(ID: ID_9)"),
    );
    expect(imageFetcher).toHaveBeenCalledWith(
      "http://d1",
      expect.stringContaining("(ID: ID_9)"),
    );
  });
});
