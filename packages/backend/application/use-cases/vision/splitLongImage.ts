import { withErrorHandling } from "@/shared/utils/error";
import sharp from "sharp";

export const splitLongImage = async (buffer: Buffer): Promise<Buffer[]> => {
  return withErrorHandling(
    async () => {
      // .rotate()를 추가하여 EXIF 회전 정보를 실제 픽셀에 적용한 뒤 메타데이터를 가져옵니다.
      const image = sharp(buffer).rotate(); 
      const { width, height } = await image.metadata();

      if (!width || !height) return [buffer];

      const MAX_PIXELS = 70_000_000;
      const totalPixels = width * height;

      if (totalPixels <= MAX_PIXELS) {
        return [buffer];
      }

      // 1. 최소 높이 1 보장 (width가 너무 클 경우 대비)
      const maxChunkHeight = Math.max(1, Math.floor(MAX_PIXELS / width));
      const OVERLAP_HEIGHT = Math.min(500, Math.floor(maxChunkHeight * 0.2));

      const chunks: Buffer[] = [];
      let currentTop = 0;

      while (currentTop < height) {
        // 2. chunkHeight가 0이 되지 않도록 보장하고 이미지 전체 높이를 넘지 않게 계산
        let chunkHeight = Math.min(maxChunkHeight, height - currentTop);
        
        // 만약 남은 높이가 너무 작거나 계산 오류로 0 이하가 되면 루프 종료
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
    },
    null,
    "sharp",
  );
};