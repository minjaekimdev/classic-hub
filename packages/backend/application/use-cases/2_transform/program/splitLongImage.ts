import sharp from "sharp";

// Google Vision API의 이미지 픽셀 한도(75M)에 안전 마진을 둔 값.
// 외부 API 계약에 의존하는 상수이므로 한도가 변경되면 함께 갱신한다.
export const MAX_PIXELS = 70_000_000;

// 실패 시 에러를 그대로 던지며, null fallback 정책은 상위 오케스트레이터가 담당한다.
export const splitLongImage = async (buffer: Buffer): Promise<Buffer[]> => {
  const image = sharp(buffer) // 문제 발생 시 rotate() 추가하기
  const { width, height } = await image.metadata();

  if (!width || !height) return [buffer];

  const totalPixels = width * height;

  if (totalPixels <= MAX_PIXELS) {
    console.log("buffer length: ", buffer.length);

    return [buffer];
  }

  // 1. 최소 높이 1 보장 (width가 너무 클 경우 대비)
  const maxChunkHeight = Math.max(1, Math.floor(MAX_PIXELS / width));
  // 500은 제목 글자까지 고려하여 넉넉하게 계산한 최소 글자 크기
  // 조각 경계에 걸친 텍스트가 두 동강 나지 않도록 인접 조각과 겹치는 높이.
  // 실제 상세 이미지 실측 기준 텍스트 줄 약 70px, 제목성 요소 약 250px이므로 500px면 2배 이상 여유.
  const OVERLAP_HEIGHT = Math.min(500, Math.floor(maxChunkHeight * 0.2));

  const chunks: Buffer[] = [];
  let currentTop = 0;

  while (currentTop < height) {
    // 2. chunkHeight가 0이 되지 않도록 보장하고 이미지 전체 높이를 넘지 않게 계산
    let chunkHeight = Math.min(maxChunkHeight, height - currentTop);

    // 만약 남은 높이가 너무 작거나 계산 오류로 0 이하가 되면 루프 종료
    // 현재 로직상으론 이 조건문에 도달하지 않지만, maxChunkHeight 계산 로직이 
    // 잘못 수정되어 0이 되면 무한루프가 되므로 이를 방지한다.
    if (chunkHeight <= 0) break;

    const chunkBuffer = await image
      .clone() // 동일한 인스턴스로 여러 번 추출할 때는 clone()이 안전합니다.
      .extract({
        left: 0,
        top: currentTop,
        width: width,
        height: chunkHeight,
      })
      .toBuffer();

    chunks.push(chunkBuffer);

    currentTop += chunkHeight;

    if (currentTop < height) {
      currentTop -= OVERLAP_HEIGHT;
      // 3. 중첩 자르기 후 currentTop이 음수가 되지 않도록 방지
      currentTop = Math.max(0, currentTop);
    }
  }
  return chunks;
};
