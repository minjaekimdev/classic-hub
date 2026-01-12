/*
  KOPIS API로부터 받은 XML을 JSON으로 변환하면
  모든 텍스트 값이 `{ _text: "..." }` 형태의 객체로 래핑되어 있음
  [원본 데이터 예시]
  { "prfnm": { "_text": "공연 이름" }, "rnum": { "_text": "1" }, ... }

  불필요하게 중첩된 객체를 재귀적으로 탐색하여
  `_text` 프로퍼티를 제거하고, 순수한 값으로 언래핑
*/

import { Facility } from "@/models/kopis";

export type JsonValue = string | null | JsonObject | JsonArray;
export interface JsonObject {
  [key: string]: JsonValue;
}
export type JsonArray = JsonValue[];

export const removeTextProperty = (obj: JsonValue): JsonValue => {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => removeTextProperty(item));
  }

  // 객체가 _text 속성만 가지고 있는 경우, _text 값을 반환
  if (Object.keys(obj).length === 1 && obj.hasOwnProperty("_text")) {
    return obj._text;
  }

  // 일반 객체의 경우
  // 아무 데이터도 없는 경우 null 반환
  if (Object.keys(obj).length === 0) return null;

  // 데이터가 존재하는 경우 각 속성에 대해 재귀적으로 처리
  const result: JsonObject = {}
  for (const key of Object.keys(obj)) {
    result[key] = removeTextProperty(obj[key]);
  }

  return result;
};
