import ocr from "@/infrastructure/external-api/vision";
import { APIError, withErrorHandling } from "shared/utils/error";

const googleHttpMapping: Record<number, number> = {
  1: 499,
  2: 500,
  3: 400,
  4: 504,
  5: 404,
  6: 409,
  7: 403,
  8: 429,
  9: 400,
  10: 409,
  11: 400,
  12: 501,
  13: 500,
  14: 503,
  15: 500,
  16: 401,
};

const getProgramText = async (
  images: Array<Buffer>,
): Promise<string | null> => {
  return withErrorHandling(
    async () => {
      // 1. 각 이미지를 개별적인 API 호출(Promise) 배열로 만듭니다.
      const ocrPromises = images.map(async (buffer) => {
        const [response] = await ocr.batchAnnotateImages({
          requests: [{
            image: { content: Buffer.from(buffer) },
            features: [{ type: "TEXT_DETECTION" as const }],
          }]
        });

        const res = response.responses?.[0];

        // 개별 응답 에러 처리
        if (res?.error) {
          const errorCode = res.error.code as number;
          const statusCode = googleHttpMapping[errorCode] || 500;
          throw new APIError(`[OCR_FAIL] ${res.error.message}`, statusCode, res.error);
        }

        return res?.fullTextAnnotation?.text || "";
      });

      // 2. 모든 호출이 완료될 때까지 기다립니다.
      const extractedTexts = await Promise.all(ocrPromises);

      // 3. 뽑아낸 텍스트 배열을 줄바꿈으로 합치기
      return extractedTexts.join("\n\n---\n\n");
    },
    null,
    "vision",
  );
};

export default getProgramText;
