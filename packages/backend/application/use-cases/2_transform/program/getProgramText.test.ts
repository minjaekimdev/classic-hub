import { describe, it, expect, vi } from "vitest";
import { createGetProgramText } from "./getProgramText";

describe("createGetProgramText", () => {
  it("여러 이미지의 텍스트를 구분자로 병합한다", async () => {
    const detectText = vi
      .fn()
      .mockResolvedValueOnce("첫 번째 텍스트")
      .mockResolvedValueOnce("두 번째 텍스트");

    const getProgramText = createGetProgramText({ detectText });
    const result = await getProgramText([Buffer.from("a"), Buffer.from("b")]);

    expect(detectText).toHaveBeenCalledTimes(2);
    expect(result).toBe("첫 번째 텍스트\n\n---\n\n두 번째 텍스트");
  });

  it("이미지가 없으면 빈 문자열을 반환한다", async () => {
    const detectText = vi.fn();
    const getProgramText = createGetProgramText({ detectText });

    const result = await getProgramText([]);

    expect(detectText).not.toHaveBeenCalled();
    expect(result).toBe("");
  });

  it("detectText 완료 순서가 뒤바겨도 입력 이미지 순서대로 병합한다", async () => {
    // 두 번째 이미지가 첫 번째보다 먼저 끝나도록 지연으로 타이밍 조작
    const detectText = vi.fn((buffer: Buffer) =>
      buffer.toString() === "slow"
        ? new Promise<string>((resolve) =>
            setTimeout(() => resolve("느린 텍스트"), 20),
          )
        : Promise.resolve("빠른 텍스트"),
    );

    const getProgramText = createGetProgramText({ detectText });
    const result = await getProgramText([
      Buffer.from("slow"),
      Buffer.from("fast"),
    ]);

    // Promise.all이 입력 순서를 보존하는지 검증 (프로그램 페이지 순서 보장)
    expect(result).toBe("느린 텍스트\n\n---\n\n빠른 텍스트");
  });

  it("detectText가 실패하면 원본 에러를 그대로 던진다", async () => {
    const detectText = vi.fn().mockRejectedValue(new Error("vision error"));
    const getProgramText = createGetProgramText({ detectText });

    // 에러 정책(null fallback)은 상위 오케스트레이터가 담당하므로
    // 이 함수는 에러를 그대로 던진다. 원인 메시지까지 검증 가능하다.
    await expect(getProgramText([Buffer.from("a")])).rejects.toThrow(
      "vision error",
    );
  });
});
