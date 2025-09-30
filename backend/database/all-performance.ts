// DB에 데이터 초기 1회 입력 시 실행하는 파일

import supabase from "../apis/supabase-client";
import { apiURL, classic, serviceKey } from "../apis/kopis-client";
import "dotenv/config";
import dayjs from "dayjs";
import convert, { ElementCompact } from "xml-js";
import getProgramJSON from "./get-program";
import { TextNode } from "@/types/common-server";

const now = dayjs();

interface PerformanceListItemType {
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
}

type PerformanceDetailType = {
  styurls?: {
    styurl: string;
  };
  program?: object;
} | null;

// 한 페이지의 공연 데이터를 리턴하는 함수
const getPerformanceArrayByPage = async (
  performanceAPI: string
): Promise<PerformanceListItemType[] | null> => {
  try {
    const response: ElementCompact = await fetch(performanceAPI)
      .then((res) => res.text())
      .then((data) => convert.xml2js(data, { compact: true }));

    const result = response.dbs.db;
    return result; // 반환타입: JsonValue, 그런데 getPerformanceArrayByPage의 반환타입은 이와 다름
  } catch (error) {
    console.log("KOPIS API로 공연 데이터 받아오기 실패");
    return null;
  }
};

const normalizeName = (name: string) => {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

type JsonValue = string | null | JsonObject | JsonArray;
interface JsonObject {
  [key: string]: JsonValue;
}
type JsonArray = JsonValue[];

// XML -> JSON 변환시 자동으로 생성되는 _text 프로퍼티를 제거하기 위한 함수
const removeTextProperty = (obj: JsonValue): JsonValue => {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => removeTextProperty(item));
  }

  // 객체가 _text 속성만 가지고 있는 경우, 정규화한 _text 값을 반환
  if (Object.keys(obj).length === 1 && obj.hasOwnProperty("_text")) {
    return normalizeName(obj._text as string);
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

// 공연 상세 데이터를 pfId가 포함된 API를 호출하여 받아온 뒤, 프로그램 데이터를 추가하여 반환하는 함수
const getPerformanceDetail = async (
  pfId: string
): Promise<[PerformanceDetailType, number]> => {
  const detailAPI = `${apiURL}/pblprfr/${pfId}?service=${serviceKey}`;
  let pfDetail: PerformanceDetailType = {};

  // 상세 데이터 호출
  try {
    const response: ElementCompact = await fetch(detailAPI)
      .then((res) => res.text())
      .then((data) => convert.xml2js(data, { compact: true }));

    pfDetail = removeTextProperty(response.dbs.db) as PerformanceDetailType;
  } catch (error) {
    console.log("KOPIS API로 공연 상세 데이터 받아오기 실패", error);
  }

  const t1 = performance.now();
  // 상세이미지 url로부터 프로그램 데이터 추출
  if (pfDetail?.styurls) {
    const programData = await getProgramJSON(pfDetail.styurls.styurl);
    pfDetail.program = programData;
  }
  const t2 = performance.now();

  return [pfDetail, t2 - t1]; // Gemini API RPM(Request Per Minute)제한 맞추기 위해 시간 차이를 함께 리턴
};

// 대상 기간동안의 모든 공연들의 id를 배열로 리턴하는 함수
const getAllPerformance = async (): Promise<TextNode[]> => {
  const stDate = now.format("YYYYMMDD");
  const edDate = now.add(90, "day").format("YYYYMMDD");
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

// 공연 상세 데이터를 DB에 추가하는 함수
const importPerformanceDetailToDB = async (pfDetail: PerformanceDetailType) => {
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
  // const performanceIdArray = await getAllPerformance();

  const stDate = now.format("YYYYMMDD");
  const edDate = now.add(90, "day").format("YYYYMMDD");

  let page = 1;
  while (true) {
    console.log(`page: ${page}`);
    const performanceAPI = `${apiURL}/pblprfr?service=${serviceKey}&stdate=${stDate}&eddate=${edDate}&cpage=${page++}&rows=${100}&shcate=${classic}`;
    const performanceArrayByPage = await getPerformanceArrayByPage(
      performanceAPI
    );

    if (!performanceArrayByPage) {
      break;
    } else {
      for (const item of performanceArrayByPage) {
        const t1 = performance.now();
        const performanceDetail = await Promise.race([
          new Promise<[PerformanceDetailType, number]>((_, reject) =>
            // 2분 이상 소요되면 다음 공연 데이터의 프로그램 받아오도록 실행
            setTimeout(() => {
              reject(new Error("Gemini API timed out after 120 seconds"));
            }, 120000)
          ),
          getPerformanceDetail(item.mt20id._text),
        ]);
        await importPerformanceDetailToDB(performanceDetail[0]);
        const t2 = performance.now();

        if (performanceDetail[1] < 4000) {
          await new Promise((r) => {
            setTimeout(() => {
              r(1);
            }, 4000 - (t2 - t1));
          });
        }
      }
    }
  }

  // for (const item of performanceIdArray) {
  //   const t1 = performance.now();
  //   try {
  //     const performanceDetail = await Promise.race([
  //       new Promise<[PerformanceDetailType, number]>((_, reject) =>
  //         // 2분 이상 소요되면 다음 공연 데이터의 프로그램 받아오도록 실행
  //         setTimeout(() => {
  //           reject(new Error("Gemini API timed out after 120 seconds"));
  //         }, 120000)
  //       ),
  //       getPerformanceDetail(item._text),
  //     ]);
  //     await importPerformanceDetailToDB(performanceDetail[0]);
  //     const t2 = performance.now();

  //     if (performanceDetail[1] < 4000) {
  //       await new Promise((r) => {
  //         setTimeout(() => {
  //           r(1);
  //         }, 4000 - (t2 - t1));
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
};

(async () => {
  await importPerformanceDataToDB();
})();
