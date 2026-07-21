import ocr from "./client";
import { APIError } from "@/shared/utils/error";

// gRPC 코드 → HTTP 상태 코드 매핑 (Google API 전용)
const GOOGLE_HTTP_MAPPING: Record<number, number> = {
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
  note?: string;
  stack?: string;
}

// Vision API 호출을 추상화한 도메인 입력/출력
// - 입력: 단일 이미지 버퍼
// - 출력: 인식된 전체 텍스트 (없으면 빈 문자열)
export interface IVisionService {
  detectText(buffer: Buffer): Promise<string>;
}

export const visionService: IVisionService = {
  async detectText(buffer: Buffer) {
    try {
      const [response] = await ocr.batchAnnotateImages({
        requests: [
          {
            image: { content: buffer },
            features: [{ type: "TEXT_DETECTION" as const }],
          },
        ],
      });

      return response.responses?.[0]?.fullTextAnnotation?.text || " ";
    } catch (rawError: unknown) {
      const error = rawError as GoogleServiceError;
      throw new APIError(
        `[OCR_FAIL] Text Detection Failed: ${error.details ?? error.note ?? "Unknown"}`,
        GOOGLE_HTTP_MAPPING[error.code] || 500,
        rawError,
      );
    }
  },
};
