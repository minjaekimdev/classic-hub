import ai from "./client";

// Gemini SDK 호출을 추상화한 도메인 입력
export interface GenerateContentParams {
  model: string;
  contents: string;
  config: {
    temperature: number;
    maxOutputTokens: number;
    responseMimeType: string;
    responseJsonSchema: unknown;
  };
}

// Gemini SDK 응답 중 사용처에서 필요한 최소 필드만 노출
export interface GenerateContentResult {
  text: string;
  usageMetadata?: GenerateContentUsageMetadata;
}

// usageMetadata 중 사용량 집계에 필요한 토큰 카운트 필드
export interface GenerateContentUsageMetadata {
  promptTokenCount?: number;
  candidatesTokenCount?: number;
  totalTokenCount?: number;
}

export interface IGeminiService {
  generateContent(params: GenerateContentParams): Promise<GenerateContentResult>;
}

export const geminiService: IGeminiService = {
  async generateContent(params: GenerateContentParams) {
    const response = await ai.models.generateContent(params);

    return {
      text: response.text ?? "",
      usageMetadata: response.usageMetadata,
    };
  },
};
