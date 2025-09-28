import "dotenv/config";
import { GoogleGenAI, Type } from "@google/genai";

interface ProgramItem {
  composerEnglish: string,
    composerKorean:string,
    era: "baroque" | "classical" | "romantic" | "modern"
    genre: "orchestral" | "opera" | "ballet" | "chamber" | "solo" | "non-classic",
    titlesEnglish: string,
    titlesKorean: string, 
}

type ProgramArray = ProgramItem[];

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
const returnContents = async (imgURL: string) => {
  const base64ImageFile = await getBase64FromUrl(imgURL);

  if (base64ImageFile) {
    const contents = [
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64ImageFile,
        },
      },
      {
        text: `
          다음 이미지를 읽고 각 공연 작품을 JSON 객체로 추출해줘.

          - composerEnglish: 작곡가 영문 이름
          - composerKorean: 작곡가 한글 이름
          - titlesEnglish: 영문 작품명
          - titlesKorean: 한글 작품명
          - era: 시대
          - genre: 장르

          규칙:
          - 각 객체는 반드시 위의 6개 키를 모두 포함할 것
          - titlesEnglish, titlesKorean의 경우 배열 형태로 여러 작품명을 담는다.
          - 단, 악장(예: "I.", "II.", "III.", "IV." 등 로마 숫자로 시작하거나 숫자 + 마침표 형식의 부제목)은 title 목록에서 제외할 것
            예: "III. Romance", "IV. Tarantella", "1. Allegro" 등은 포함하지 않는다.
          - era는 반드시 아래 값 중 하나만 선택할 것. 이외의 값은 절대 사용하지 않는다.
            ["baroque", "classical", "romantic", "modern"]
          - genre는 반드시 아래 값 중 하나 이상을 골라 배열로 만들 것. 이외의 값은 절대 사용하지 않는다.
            ["orchestral", "opera", "ballet", "chamber", "solo", "non-classic"]
          - 반드시 한 작곡가에 대해 하나의 객체만 생성
          - 마크다운 문법('''json''') 제외하고 순수 json만 반환
        `,
      },
    ];

    return contents;
  } else {
    return "";
  }
};

// generateContent 옵션 및 응답 형식 지정, 모델에 요청
export const getProgramJSON = async (imgURL: string): Promise<string[]> => {
  const contents = await returnContents(imgURL);

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
            era: { type: Type.STRING },
            genre: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
        },
      },
    },
  });

  console.log(response.usageMetadata); // 사용 토큰 수 출력

  if (response?.text) {
    // response가 undefiend/null이 아니면 실행
    const responseSplit = response.text.split("\n");

    /// 결과 상하단에 마크다운 문법 (```json```)이 있는 경우 삭제
    while (responseSplit[0] != "[") {
      responseSplit.splice(0, 1);
    }
    while (responseSplit[responseSplit.length - 1] != "]") {
      responseSplit.splice(-1, 1);
    }

    return JSON.parse(responseSplit.join("\n"));
  } else {
    return [];
  }
};

// (async () => {
//   const response = await getProgramJSON(
//     "http://www.kopis.or.kr/upload/pfmIntroImage/PF_PF268597_202507041233477990.jpg"
//   );
//   console.log(response);
// })();

export default getProgramJSON;
