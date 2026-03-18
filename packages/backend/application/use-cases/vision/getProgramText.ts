import ocr from "@/infrastructure/external-api/vision";
import logger from "@/shared/utils/logger";

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

interface GoogleServiceError {
  code: number;
  details?: string;
  note? : string;
  metadata?: any;
  stack?: any;
}

export const withGoogleErrorHandling = async <T>(
  operation: () => Promise<T>,
  fallback?: any,
  service: string = "vision",
): Promise<T> => {
  try {
    return await operation();
  } catch (rawError: unknown) {
    const error = rawError as GoogleServiceError;
    const customErrorObj = {
      code: googleHttpMapping[error.code] || 500,
      detail: error.details,
      note: error.note
    }
    logger.error("[OCR_FAIL] Text Detection Failed", {error: customErrorObj, stack: error.stack, service });
    
    if (fallback !== undefined) {
      return fallback;
    }
    throw error;
  }
};


const getProgramText = async (
  images: Array<Buffer>,
): Promise<string | null> => {
  return withGoogleErrorHandling(async () => {
    // 분할된 각 이미지를 개별적인 API 호출(Promise) 배열로 만든다.
    // 한 번에 호출할 경우 제한에 걸릴 수 있다.
    const ocrPromises = images.map(async (buffer) => {
      const [response] = await ocr.batchAnnotateImages({
        requests: [
          {
            image: { content: buffer },
            features: [{ type: "TEXT_DETECTION" as const }],
          },
        ],
      });

      const res = response.responses?.[0];
      // 인식된 텍스트가 없을 경우 공백 문자열 반환하기
      return res?.fullTextAnnotation?.text || " ";
    });

    // 2. 모든 호출이 완료될 때까지 기다립니다.
    const extractedTexts = await Promise.all(ocrPromises);

    // 3. 뽑아낸 텍스트 배열을 줄바꿈으로 합치기
    return extractedTexts.join("\n\n---\n\n");
  });
};

export default getProgramText;
