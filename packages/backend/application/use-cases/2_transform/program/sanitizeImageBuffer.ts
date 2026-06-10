import { withErrorHandling } from "@/shared/utils/error";
import sharp from "sharp";

export const sanitizeImageBuffer = (raw: Buffer) => {
  return withErrorHandling(async () => {
    const cleanedBuffer = await sharp(raw)
      .jpeg({
        quality: 100, // 화질 저하 최소화
        chromaSubsampling: "4:4:4", // 색상 정보 손실 방지
        force: true, // 강제로 다시 인코딩하여 쓰레기 데이터 제거
      })
      .toBuffer();

    return cleanedBuffer;
  }, null, "sharp");
};
