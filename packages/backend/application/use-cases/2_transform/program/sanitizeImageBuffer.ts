import sharp from "sharp";

// 실패 시 에러를 그대로 던지며, null fallback 정책은 상위 오케스트레이터가 담당한다.
export const sanitizeImageBuffer = async (raw: Buffer): Promise<Buffer> => {
  const cleanedBuffer = await sharp(raw)
    .jpeg({
      quality: 100, // 화질 저하 최소화
      chromaSubsampling: "4:4:4", // 색상 정보 손실 방지
      force: true, // 강제로 다시 인코딩하여 쓰레기 데이터 제거
    })
    .toBuffer();

  return cleanedBuffer;
};
