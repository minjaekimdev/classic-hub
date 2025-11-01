import "dotenv/config";
import { GoogleGenAI, Type } from "@google/genai";

interface ProgramItem {
  composerEnglish: string;
  composerKorean: string;
  titlesEnglish: string[];
  titlesKorean: string[];
}

export type ProgramArray = ProgramItem[];

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 공연 상세이미지 url로부터 바이너리 데이터를 받아 base64로 변환한 값을 리턴하는 함수
const getBase64FromUrl = async (url: string) => {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return buffer.toString("base64");
  } catch (error) {
    console.log("이미지url을 통한 불러오기 실패", error);
    return null;
  }
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
    return [];
  }

  // 3. 이미지 파트 배열과 텍스트 프롬프트를 합쳐서 최종 contents 배열 반환
  const prompt = {
    text: `
      다음 이미지들을 모두 참고하여 공연 프로그램을 JSON 객체로 추출해줘.
      여러 이미지에 정보가 나뉘어 있을 수 있으니 종합적으로 판단해야 해.

      - composerEnglish: 작곡가 영문 이름
      - composerKorean: 작곡가 한글 이름
      - titlesEnglish: 영문 작품명
      - titlesKorean: 한글 작품명

      공통 규칙:
      - 각 객체는 반드시 위의 4개 키를 모두 포함할 것
      - 마크다운 문법('''json''') 제외하고 순수 json만 반환
      - 반드시 한 작곡가에 대해 하나의 객체만 생성
      - titlesEnglish의 경우 악장("I.", "II.", "III.", "IV." 등 로마 숫자로 시작하거나 숫자 + 마침표 형식의 부제목)은 제외할 것
        예: "III. Romance", "IV. Tarantella", "1. Allegro" 등은 포함하지 않는다.
    `,
  };

  return [...imageParts, prompt];
};

export const buildContentFromText = async (sty: string) => {
  // 3. 이미지 파트 배열과 텍스트 프롬프트를 합쳐서 최종 contents 배열 반환
  const prompt = {
    text: `
    다음 텍스트에서 공연 프로그램을 읽고 JSON 객체로 추출해줘.

    - composerEnglish: 작곡가 영문 이름
    - composerKorean: 작곡가 한글 이름
    - titlesEnglish: 영문 작품명
    - titlesKorean: 한글 작품명

    공통 규칙:
    - 각 객체는 반드시 위의 4개 키를 모두 포함할 것
    - 마크다운 문법('''json''') 제외하고 순수 json만 반환
    - 반드시 한 작곡가에 대해 하나의 객체만 생성
    - titlesEnglish의 경우 악장("I.", "II.", "III.", "IV." 등 로마 숫자로 시작하거나 숫자 + 마침표 형식의 부제목)은 제외할 것
      예: "III. Romance", "IV. Tarantella", "1. Allegro" 등은 포함하지 않는다.
    - 입력 텍스트 하단의 주의 문구("* 프로그램 및 연주자가 변경될 수 있습니다.")는 무시한다.
    `,
  };

  return [sty, prompt];
};

// generateContent 옵션 및 응답 형식 지정, 모델에 요청
export const getProgramJSON = async (
  sty: string | { styurl: string | string[] }
): Promise<ProgramArray> => {
  let contents;

  if (typeof sty === "string") {
    contents = await buildContentFromText(sty);
  } else {
    const urls = Array.isArray(sty.styurl) ? sty.styurl : [sty.styurl];
    contents = await buildContentFromUrls(urls);

    if (contents.length === 0) {
      console.log("이미지를 처리할 수 없어 요청을 보내지 않습니다.");
      return [];
    }
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: contents,
      config: {
        maxOutputTokens: 15000,
        thinkingConfig: {
          thinkingBudget: 10000,
        },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              composerEnglish: { type: Type.STRING },
              composerKorean: { type: Type.STRING },
              titlesEnglish: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              titlesKorean: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            propertyOrdering: [
              "composerEnglish",
              "composerKorean",
              "titlesEnglish",
              "titlesKorean",
            ],
          },
        },
      },
    });

    console.log(response.usageMetadata); // 사용 토큰 수 출력

    if (!response?.text) {
      return [];
    }

    console.log(response.text);

    try {
      return JSON.parse(response.text);
    } catch (error) {
      console.error("JSON 파싱 실패:", error);
      return [];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default getProgramJSON;
