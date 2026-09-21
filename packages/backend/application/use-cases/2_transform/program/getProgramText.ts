import { ApiUsage } from "shared/types/sync";

export interface GetProgramTextDeps {
  detectText: (buffer: Buffer) => Promise<string>;
}

// 분할된 이미지 버퍼 배열에서 각각 텍스트를 추출하여 하나의 문자열로 병합
// 실패 시 에러를 그대로 던지며, null fallback 정책은 상위 오케스트레이터가 담당한다.
export const createGetProgramText = ({ detectText }: GetProgramTextDeps) => {
  return async (images: Buffer[], usage?: ApiUsage): Promise<string> => {
    // Vision API는 이미지 1장 = 요청 1건이므로, 성공 여부와 무관하게
    // 실제로 보낸 요청 수(=분할 이미지 수)를 집계한다.
    if (usage) usage.visionRequests += images.length;
    const extractedTexts = await Promise.all(
      images.map(async (buffer) => detectText(buffer)),
    );
    // 토크나이저는 \n\n와 ---를 잘 압축해서 대략 3~4토큰 수준, 이걸 최적화할 필요는 X.
    return extractedTexts.join("\n\n---\n\n");
  };
};
