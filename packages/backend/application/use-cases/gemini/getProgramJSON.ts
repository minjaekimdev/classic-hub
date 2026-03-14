import "dotenv/config";
import ai from "@/infrastructure/external-api/gemini";
import { APIError, withErrorHandling } from "shared/utils/error";
import logger from "shared/utils/logger";
import { ProgramExtractionResponse } from "shared/types/gemini";

/**
 * KOPIS 응답의 프로그램 텍스트를 분석하여 구조화된 JSON으로 변환하는 함수
 */
const getProgramJSON = async (
  programText: string,
): Promise<ProgramExtractionResponse | null> => {
  const instruction = `
너는 클래식 음악 프로그램 데이터 추출 전문가야. 제공된 텍스트에서 오로지 '작곡가'와 '연주 곡목'만 추출해서 JSON 배열 형태로 응답해.

### 반드시 지켜야 할 추출 규칙:
1. 연주자 제외 (STRICT EXCLUSION): 
   - 피아니스트, 바이올리니스트, 지휘자, 협연자, 오케스트라, 성악가 성함은 절대로 포함하지 마.
   - 예: "Vn. 김철수", "Piano 홍길동", "지휘: 이영희", "소프라노 박지민", "Pianist 이정은" 등은 무시하고 건너뛰어.
   - 작곡가를 찾을 수 없는 경우 composerKo, composerEn 필드를 모두 null로 저장해.
2. 작곡가 성명 통합: 
   - 성(Last Name)과 이름(First Name)을 분리하지 말고, "루드비히 반 베토벤"과 같이 전체 성명을 하나의 문자열로 작성해.
3. 작곡가 기준 그룹화: 
   - 동일한 작곡가의 곡이 여러 개라면, 해당 작곡가 객체 하나에 모든 곡 제목을 배열로 담아.
4. 편곡(Arrangement) 규칙: 
   - 편곡된 곡의 경우 원곡 작곡가가 아닌 '편곡자'를 작곡가 필드에 기입해.
5. 한영 병기 (Bilingual): 
   - 모든 필드는 한국어와 영어를 모두 채워야 해. 텍스트에 한 쪽 언어만 있다면 가장 표준적인 명칭으로 번역해서 채워.
6. 악장 제외: 
   - 곡의 전체 제목만 추출하고, 하위 악장(Movement) 정보는 포함하지 마.
분석할 프로그램 텍스트:
`;

  return withErrorHandling(
    async () => {
      const response = await ai.models.generateContent({
        // 최신 고성능/저비용 모델 사용 (필요 시 버전 조정)
        model: "gemini-2.5-flash-lite", 
        contents: instruction + programText,
        config: {
          temperature: 0, // 결과의 일관성을 위해 0으로 고정
          maxOutputTokens: 15000,
          responseMimeType: "application/json",
          responseJsonSchema: {
            type: "array",
            description: "작곡가별 연주 곡목 리스트",
            items: {
              type: "object",
              properties: {
                composerKo: {
                  type: ["string", "null"],
                  description: "작곡가 또는 편곡자의 한국어 전체 성명",
                },
                composerEn: {
                  type: ["string", "null"],
                  description: "Full name of the composer in English",
                },
                workTitleKr: {
                  type: "array",
                  items: { type: "string" },
                  description: "연주 곡목의 한국어 제목 리스트 (악장 제외)",
                },
                workTitleEn: {
                  type: "array",
                  items: { type: "string" },
                  description: "List of work titles in English (Excluding movements)",
                },
              },
              required: [
                "composerKo",
                "composerEn",
                "workTitleKr",
                "workTitleEn",
              ],
            },
          },
        },
      });

      if (!response?.text) {
        throw new APIError("Gemini API가 빈 응답을 반환했습니다.");
      }

      logger.info("Gemini 프로그램 분석 완료", {
        service: "gemini",
        usage: response.usageMetadata,
      });

      // Gemini가 반환한 JSON 문자열을 파싱하여 반환
      return JSON.parse(response.text);
    },
    null,
    "gemini",
  );
};

export default getProgramJSON;