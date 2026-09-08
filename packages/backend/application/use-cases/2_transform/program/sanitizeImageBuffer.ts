import sharp from "sharp";

// 상세 이미지 버퍼의 더미데이터를 삭제한다.
// 실패 시 에러를 그대로 던지며, null fallback 정책은 상위 오케스트레이터가 담당한다.
export const sanitizeImageBuffer = async (raw: Buffer): Promise<Buffer> => {
  const cleanedBuffer = await sharp(raw)
    .jpeg({ // jpeg는 구조가 극도로 단순해서 메타데이터, 더미 데이터 등을 제외시킨다.
      quality: 100, // 화질 저하 최소화
      chromaSubsampling: "4:4:4", // 색상 정보 손실 방지(JPEG는 색상 정보를 일부 버림)
      force: true, // 입력이 이미 JPEG여도 강제로 다시 인코딩하여 쓰레기 데이터 제거
    }) // 아직까지는 옵션만 지정한 상태이다.
    .toBuffer(); // 여기서 실제로 변환된다.

  return cleanedBuffer;
};
