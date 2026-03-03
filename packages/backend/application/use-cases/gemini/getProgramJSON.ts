import "dotenv/config";
import ai from "@/infrastructure/external-api/gemini";
import { APIError, withErrorHandling } from "utils/error";
import logger from "utils/logger";
import { ProgramExtractionResponse } from "@/models/gemini";

// KOPIS 응답에 존재하는 프로그램 텍스트 혹은 OCR로 부터 추출한 프로그램 텍스트를 구조화된 JSON으로 변환하는 함수
const getProgramJSON = async (
  programText: string,
): Promise<ProgramExtractionResponse | []> => {
  const instruction =
    "You are a music program expert. Your goal is to extract composer and work information from the text.\n" +
    "GROUP BY COMPOSER: Each object in the resulting array must represent exactly one unique composer. " +
    "If a composer has multiple works in the text, collect all of them into the respective 'workTitle' and 'catalogNumber' arrays within that single composer's object.\n" +
    "ARRANGEMENT RULE: For arrangements, extract ONLY the name of the arranger as the composer. Do not include the original composer.\n" +
    "BILINGUAL REQUIREMENT: Fill all fields in both Korean and English. Translate accurately if only one language is provided.\n\n" +
    "Program Text to process:\n";

  return withErrorHandling(
    async () => {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: instruction + programText,
        config: {
          temperature: 0,
          maxOutputTokens: 15000,
          thinkingConfig: {
            thinkingBudget: 10000,
          },
          responseMimeType: "application/json",
          responseJsonSchema: {
            type: "array",
            description:
              "A list of unique composers, each containing an array of their musical works found in the text.",
            items: {
              type: "object",
              properties: {
                firstNameKo: {
                  type: "string",
                  description: "Composer's first name in Korean.",
                },
                firstNameEn: {
                  type: "string",
                  description: "Composer's first name in English.",
                },
                lastNameKo: {
                  type: "string",
                  description: "Composer's last name in Korean.",
                },
                lastNameEn: {
                  type: "string",
                  description: "Composer's last name in English.",
                },
                workTitleKr: {
                  type: "array",
                  items: { type: "string" },
                  description:
                    "List of main titles in Korean for this composer. EXCLUDE movements.",
                },
                workTitleEn: {
                  type: "array",
                  items: { type: "string" },
                  description:
                    "List of main titles in English for this composer. EXCLUDE movements.",
                },
              },
              required: [
                "firstNameKo",
                "firstNameEn",
                "lastNameKo",
                "lastNameEn",
                "workTitleKr",
                "workTitleEn",
              ],
            },
          },
        },
      });

      if (!response?.text) {
        throw new APIError("Gemini API response has no data!");
      }

      logger.info("gemini usage & result", {
        service: "gemini",
        program: response.text,
        usage: response.usageMetadata,
      });

      return JSON.parse(response.text);
    },
    null,
    "gemini",
  );
};

export default getProgramJSON;
