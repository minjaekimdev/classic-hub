export interface GetProgramTextDeps {
  detectText: (buffer: Buffer) => Promise<string>;
}

// 분할된 이미지 버퍼 배열에서 각각 텍스트를 추출하여 하나의 문자열로 병합
// 실패 시 에러를 그대로 던지며, null fallback 정책은 상위 오케스트레이터가 담당한다.
export const createGetProgramText = ({ detectText }: GetProgramTextDeps) => {
  return async (images: Buffer[]): Promise<string> => {
    const extractedTexts = await Promise.all(
      images.map(async (buffer) => detectText(buffer)),
    );
    // 토크나이저는 \n\n와 ---를 잘 압축해서 대략 3~4토큰 수준, 이걸 최적화할 필요는 X.
    return extractedTexts.join("\n\n---\n\n");
  };
};
