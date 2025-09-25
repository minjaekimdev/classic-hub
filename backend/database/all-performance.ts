import supabase from "../apis/supabase-client";
import { apiURL, classic, serviceKey } from "../apis/kopis-client";
import "dotenv/config";
import dayjs from "dayjs";
import convert, { ElementCompact } from "xml-js";
import { TextNode } from "@/types/common-server";

const now = dayjs();

const getPerformanceArrayByPage = async (
  performanceAPI: string
): Promise<
  | {
      mt20id: TextNode; // 공연 id
      prfnm: TextNode; // 공연명
      prfpdfrom: TextNode; // 공연시작일
      prfpdto: TextNode; // 공연종료일
      fcltynm: TextNode; // 공연장명
      poster: TextNode; // 포스터 URL
      area: TextNode; // 지역
      genrenm: TextNode; // 장르
      openrun: TextNode; // 오픈런여부
      prfstate: TextNode; // 공연상태
    }[]
  | null
> => {
  try {
    const response: ElementCompact = await fetch(performanceAPI)
      .then((res) => res.text())
      .then((data) => convert.xml2js(data, { compact: true }));

    const result = response.dbs.db;
    return result;
  } catch (error) {
    console.log("KOPIS API로 공연 데이터 받아오기 실패");
    return null;
  }
};

type JsonValue = string | null | JsonObject | JsonArray;
interface JsonObject {
  [key: string]: JsonValue;
}
type JsonArray = JsonValue[];

const removeTextProperty = (obj: JsonValue): JsonValue => {
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

const getPerformanceDetail = async (pfId: string) => {
  const detailAPI = `${apiURL}/pblprfr/${pfId}?service=${serviceKey}`;

  try {
    const response: ElementCompact = await fetch(detailAPI)
      .then((res) => res.text())
      .then((data) => convert.xml2js(data, { compact: true }));

    const pfDetail = response.dbs.db;

    return removeTextProperty(pfDetail);
  } catch (error) {
    console.log("공연 상세 정보 받아오기 실패", error);
    return null;
  }
};

const getAllPerformance = async (): Promise<TextNode[]> => {
  const stDate = now.subtract(1, "day").format("YYYYMMDD");
  const edDate = now.add(89, "day").format("YYYYMMDD");
  const performanceIdArray = [];

  let page = 1;
  while (true) {
    const performanceAPI = `${apiURL}/pblprfr?service=${serviceKey}&stdate=${stDate}&eddate=${edDate}&cpage=${page++}&rows=${100}&shcate=${classic}`;
    const performanceArrayByPage = await getPerformanceArrayByPage(
      performanceAPI
    );

    if (!performanceArrayByPage) {
      break;
    } else {
      for (const item of performanceArrayByPage) {
        performanceIdArray.push(item.mt20id);
      }
    }

    await new Promise((r) => {
      setTimeout(r, 100);
    });
  }

  return performanceIdArray;
};

const importPerformanceDetailToDB = async (pfDetail: JsonValue) => {
  const { error } = await supabase
    .from("performance_list")
    .upsert(pfDetail, { onConflict: "mt20id" });

  if (error) {
    console.log("performance_list에 3개월간 공연 데이터 삽입 실패", error);
  } else {
    console.log("performance_list에 3개월간 공연 데이터 삽입 성공");
  }
};

export const importPerformanceDataToDB = async () => {
  const performanceIdArray = await getAllPerformance();

  for (const item of performanceIdArray) {
    const performanceDetail = await getPerformanceDetail(item._text);
    importPerformanceDetailToDB(performanceDetail);
  }
};

importPerformanceDataToDB();
