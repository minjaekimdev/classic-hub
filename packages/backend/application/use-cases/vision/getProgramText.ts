import ocr from "@/infrastructure/external-api/vision";
import { APIError, withErrorHandling } from "utils/error";

const getProgramText = async (images: Array<ArrayBuffer>) => {
  return withErrorHandling(async () => {
    // 상세 이미지들에서 텍스트 추출
    const requests = images.map((buffer) => ({
      image: { content: Buffer.from(buffer) },
      features: [{ type: "TEXT_DETECTION" as const }],
    }));

    const [response] = await ocr.batchAnnotateImages({ requests });

    const extractedTexts =
      response.responses?.map((res) => {
        // 개별 이미지 분석 중 에러가 있었는지 체크하는 것이 안전하다.
        if (res.error) {
          throw new APIError("[OCR_FAIL] Text Extract failed");
        }

        // 전체 텍스트 데이터만 반환
        return res.fullTextAnnotation?.text || "";
      }) || [];

    // 뽑아낸 텍스트 배열을 줄바꿈으로 합치기
    return extractedTexts.join("\n\n---\n\n");
  }, null, "vision");
};

export default getProgramText;
