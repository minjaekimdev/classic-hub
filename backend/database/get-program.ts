import "dotenv/config";
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

          - composer: 작곡가 이름
          - title: 작품명
          - era: 시대
          - genre: 장르(예: orchestral, stage, chamber, solo)

          규칙:
          - era는 반드시 아래 값 중 하나만 선택할 것. 이외의 값은 절대 사용하지 않는다.
            ["baroque", "classical", "romantic", "modern"]
          - genre는 반드시 아래 값 중 하나만 선택할 것. 이외의 값은 절대 사용하지 않는다.
            ["orchestral", "stage", "chamber", "solo"]
          - era와 genre는 반드시 예시 중 하나 사용
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

const getProgramJSON = async (imgURL: string) => {
  const contents = await returnContents(imgURL);

  const geminiPromise = ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: contents,
    config: {
      thinkingConfig: {
        thinkingBudget: 0,
      },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            composer: {
              type: Type.STRING,
            },
            title: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
            },
            era: {
              type: Type.STRING,
            },
            genre: {
              type: Type.STRING,
            },
          },
          propertyOrdering: ["composer", "title", "era", "genre"],
        },
      },
    },
  });

  const timeoutPromise = new Promise<null>((_, reject) =>
    setTimeout(() => reject(new Error("Gemini 호출 타임아웃")), 15000)
  );

  let response;
  try {
    response = await Promise.race([geminiPromise, timeoutPromise]);
  } catch (err) {
    console.warn(err);
    return []; // 타임아웃 시 빈 배열 반환
  }
  
  if (response?.text) {
    const responseSplit = response.text.split("\n");
    /// 결과 상하단에 마크다운 문법 (```json```)이 있는 경우 삭제
    if (responseSplit[0] !== "[") {
      responseSplit.splice(0, 1);
    }
    if (responseSplit[responseSplit.length - 1] !== "]") {
      responseSplit.splice(responseSplit.length - 1, 1);
    }

    return JSON.parse(responseSplit.join("\n"));
  }
};

export default getProgramJSON;
