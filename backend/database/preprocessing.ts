import { ProgramArray } from "./get-program";

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

  // 일반 객체의 경우, 각 속성에 대해 재귀적으로 처리
  const result: JsonObject = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = removeTextProperty(obj[key]);
    }
  }

  return result;
};
