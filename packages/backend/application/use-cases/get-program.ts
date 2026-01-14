import "dotenv/config";
import { Type } from "@google/genai";
import ai from "@/infrastructure/external-api/gemini";
import { APIError, withErrorHandling } from "utils/error";
import logger from "utils/logger";
import { ProgramExtractionResponse } from "@/models/gemini";

// 공연 상세이미지 url로부터 바이너리 데이터를 받아 base64로 변환한 값을 리턴하는 함수
const getBase64FromUrl = async (url: string) => {
  return withErrorHandling(async () => {
    const response = await fetch(url);

    if (!response.ok) {
      throw new APIError(
        `program image API call failed: ${response.status}`,
        response.status
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return buffer.toString("base64");
  }, null);
};

// 공연 상세 이미지 URL을 받아 프롬프트와 함께 Gemini에 전달
const buildContentFromUrls = async (imgURLs: string[]) => {
  // 1. 모든 이미지 URL을 base64로 변환 (병렬 처리)
  const base64Images = await Promise.all(
    imgURLs.map((url) => getBase64FromUrl(url))
  );

  // 2. 변환에 성공한 base64 데이터만 필터링하여 이미지 파트 생성
  const imageParts = base64Images
    .filter((base64) => base64 !== null) // 변환 실패(null)한 경우 제외
    .map((base64) => ({
      inlineData: {
        mimeType: "image/jpeg",
        data: base64!,
      },
    }));

  // 이미지가 하나도 없으면 빈 배열 반환
  if (imageParts.length === 0) {
    return null;
  }

  return [...imageParts];
};

const systemInstruction = `Persona: You are a Forensic Data Entry Clerk specializing in music catalogs. You have expert-level knowledge in identifying musical structures (Composers, Titles, Catalog numbers), but you have ZERO authorization to infer or add any information not visually present in the provided content.`;

// generateContent 옵션 및 응답 형식 지정, 모델에 요청
export const getProgramJSON = async (
  performanceId: string,
  sty: string | { styurl: string | string[] }
): Promise<ProgramExtractionResponse | []> => {
  let contents;

  if (typeof sty === "string") {
    contents = [sty, systemInstruction];
  } else {
    const urls = Array.isArray(sty.styurl) ? sty.styurl : [sty.styurl];
    const processedImage = await buildContentFromUrls(urls);

    if (!processedImage) {
      return [];
    }

    contents = [...processedImage, systemInstruction];
  }

  return withErrorHandling(
    async () => {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: contents,
        config: {
          temperature: 0,
          maxOutputTokens: 15000,
          thinkingConfig: {
            thinkingBudget: 10000,
          },
          responseMimeType: "application/json",
          responseJsonSchema: {
            // Math.max(item.date) 형식으로 며칠동안 하는지 알 수 있음
            type: "array",
            description:
              "A comprehensive flat list of musical works extracted from the provided content's program list.",
            items: {
              type: "object",
              properties: {
                composerNameEn: {
                  type: ["string", "null"],
                  description:
                    "Full name of the composer in English. Extract data ONLY from the provided content's program list. Return null if unidentified.",
                },
                composerNameKr: {
                  type: ["string", "null"],
                  description:
                    "Full name of the composer in Korean.  Extract data ONLY from the provided content's program list. Return null if unidentified.",
                },
                workTitleEn: {
                  type: ["string", "null"],
                  description:
                    "Title of the work in English. Exclude catalog numbers. Extract data ONLY from the provided content's program list. Return null if unidentified.",
                },
                workTitleKr: {
                  type: ["string", "null"],
                  description:
                    "Title of the work in Korean. Exclude catalog numbers. Extract data ONLY from the provided content's program list. Return null if unidentified.",
                },
                catalogNumber: {
                  type: ["string", "null"],
                  description:
                    "Opus or catalog number of the work. Extract data ONLY from the provided content's program list. Return null if unidentified.",
                },
              },
              required: [
                "composerNameEn",
                "composerNameKr",
                "workTitleEn",
                "workTitleKr",
                "catalogNumber",
              ],
            },
          },
        },
      });

      // 응답은 도달했지만 결과 데이터가 없는 경우
      if (!response?.text) {
        throw new APIError("Gemini API response has no data!");
      }
      console.log(response.usageMetadata); // 사용 토큰 수 출력
      console.log(response.text); // 프로그램 출력

      try {
        logger.info("program extract succeeded", { service: "gemini" });
        return JSON.parse(response.text);
      } catch (error) {
        // JSON 형식이 올바르지 않은 경우
        logger.error("JSON parsing failed!", { performanceId, error });
        return [];
      }
    },
    // API 요청 자체가 도달하지 못한 경우, 응답은 도달했지만 결과 데이터가 없는 경우 실행될 fallback
    () => {
      logger.error("Gemini API request failed!", {
        performanceId,
        service: "gemini",
      });
      return [];
    },
    "gemini"
  );
};

export default getProgramJSON;
