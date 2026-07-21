import { withErrorHandling } from "@/shared/utils/error";

export interface GetProgramTextDeps {
  detectText: (buffer: Buffer) => Promise<string>;
}

// 분할된 이미지 버퍼 배열에서 각각 텍스트를 추출하여 하나의 문자열로 병합
export const createGetProgramText = ({ detectText }: GetProgramTextDeps) => {
  return async (images: Buffer[]): Promise<string | null> => {
    return withErrorHandling(
      async () => {
        const extractedTexts = await Promise.all(
          images.map(async (buffer) => detectText(buffer)),
        );
        return extractedTexts.join("\n\n---\n\n");
      },
      null,
      "vision",
    );
  };
};
