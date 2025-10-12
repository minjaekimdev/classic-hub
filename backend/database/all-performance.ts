// Edge Functions 밖 환경에서 사용

import supabase from "../apis/supabase-client";
import { API_URL, CLASSIC, SERVICE_KEY } from "../apis/kopis-client";
import "dotenv/config";
import dayjs from "dayjs";
import convert, { ElementCompact } from "xml-js";
import getProgramJSON from "./get-program";
import { TextNode } from "@/types/common-server";
import type { ProgramArray } from "./get-program";
import { ComputeTokensResponse } from "@google/genai";

const TARGET_PERIOD = 90;

const now = dayjs();

interface PerformanceItemType {
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
const getPerformanceItemsInPage = async (
  // 한 페이지의 공연 데이터(100개)를 배열로 반환
  performanceAPI: string
): Promise<PerformanceItemType[] | null> => {
  try {
    const response: ElementCompact = await fetch(performanceAPI)
      .then((res) => res.text())
      .then((data) => convert.xml2js(data, { compact: true }));

    const result = response.dbs.db;
    if (!result) {
      return null;
    }
    return Array.isArray(result) ? result : [result]; // result가 하나인 경우 단일 객체이므로 배열로 만들어주기
  } catch (error) {
    console.log("KOPIS API로 공연 데이터 받아오기 실패", error);
    return null;
  }
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

const normalizeName = (name: string) => {
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const normalizeProgramData = (programData: ProgramArray) => {
  return programData.map((element) => {
    return {
      composerEnglish: normalizeName(element.composerEnglish),
      composerKorean: element.composerKorean,
      titlesEnglish: element.titlesEnglish.map(normalizeName),
      titlesKorean: element.titlesKorean,
    };
  });
};

// 공연 상세 데이터를 pfId가 포함된 API를 호출하여 받아온 뒤, 프로그램 데이터를 추가하여 반환하는 함수
const getPerformanceDetail = async (
  pfId: string
): Promise<[PerformanceDetailType, number]> => {
  const detailAPI = `${API_URL}/pblprfr/${pfId}?service=${SERVICE_KEY}`;
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
    const normalizedProgram = normalizeProgramData(programData);
    console.log(normalizedProgram);
    pfDetail.program = normalizedProgram;
  }
  const t2 = performance.now();

  return [pfDetail, t2 - t1]; // Gemini API RPM(Request Per Minute)제한 맞추기 위해 시간 차이를 함께 리턴
};

// 하나의 공연 상세 데이터를 DB에 추가하는 함수
const importPerformanceDetailToDB = async (pfDetail: PerformanceDetailType) => {
  const { error } = await supabase
    .from("performance_list")
    .upsert(pfDetail, { onConflict: "mt20id" });

  if (error) {
    console.log("performance_list에 공연 데이터 삽입 실패", error);
  } else {
    console.log("performance_list에 공연 데이터 삽입 성공");
  }
};

// 대상 기간동안의 모든 공연 데이터를 받아오는 함수
const getNewPerformanceItems = async (): Promise<PerformanceItemType[]> => {
  const stDate = now.format("YYYYMMDD");
  const edDate = now.add(TARGET_PERIOD, "day").format("YYYYMMDD"); // 향후 3개월간의 공연들을 대상으로
  const performanceItemArray: PerformanceItemType[] = [];

  let page = 1;
  while (true) {
    const performanceAPI = `${API_URL}/pblprfr?service=${SERVICE_KEY}&stdate=${stDate}&eddate=${edDate}&cpage=${page++}&rows=${100}&shcate=${CLASSIC}`;
    const performanceItemArrayByPage = await getPerformanceItemsInPage(
      performanceAPI
    );

    if (!performanceItemArrayByPage) {
      break;
    } else {
      for (const item of performanceItemArrayByPage) {
        performanceItemArray.push(item);
      }
    }

    await new Promise((r) => {
      // 초당 10회 호출 제한
      setTimeout(r, 100);
    });
  }

  return performanceItemArray;
};

// DB performance_list 테이블에 존재하는 공연id를 배열로 반환하는 함수
const getOldPfIdArray = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from("performance_list")
    .select("mt20id");

  if (error) {
    console.log("performance_list table에서 mt20id 컬럼 가져오기 실패");
    return [];
  }
  return data.map((element: { mt20id: string }) => element.mt20id);
};

const deletePerformanceById = async (pfId: string) => {
  const { error } = await supabase
    .from("performance_list")
    .delete()
    .eq("mt20id", pfId);

  if (error) {
    console.log("DB performance_list에서 데이터 삭제 실패");
  } else {
    console.log("DB performance_list에서 데이터 삭제 성공");
  }
};

// 새 공연 데이터(오늘 ~ 오늘+대상 기간 사이의 공연 데이터)에는 없고, DB에만 존재하는 공연 데이터를 삭제하는 함수
const deleteOldDataInDB = async (
  newPfIdSet: Set<string>,
  oldPfIdArray: string[]
) => {
  const idsToDelete = oldPfIdArray.filter((pfId) => !newPfIdSet.has(pfId));
  console.log("performances to delete:", idsToDelete);
  await Promise.all(
    idsToDelete.map(async (pfId) => {
      deletePerformanceById(pfId);
    })
  );
};

// DB에는 없고 새 공연 데이터(오늘 ~ 오늘+대상 기간 사이의 공연 데이터)에만 존재하는 공연 데이터를 DB에 추가하는 함수
const addNewDataToDB = async (
  oldPfIdSet: Set<string>,
  newPfIdArray: string[]
) => {
  const idsToAdd = newPfIdArray.filter((pfId) => !oldPfIdSet.has(pfId));
  console.log("performances to add:", idsToAdd);

  for (const pfId of idsToAdd) {
    const performanceDetail = await getPerformanceDetail(pfId);
    await importPerformanceDetailToDB(performanceDetail[0]);
    if (performanceDetail[1] < 4000) {
      await new Promise((r) => setTimeout(r, 4000 - performanceDetail[1]));
    }
  }
};

// afterDate 이후로 stdate~eddate 사이의 공연에서 수정/등록된 공연 데이터의 공연id를 받아오는 함수
const getUpdatedPerformancesId = async (dateObj: {
  after: string;
  start: string;
  end: string;
}): Promise<string[]> => {
  const updatedPerformancesIdArray = [];

  let page = 1;
  while (true) {
    const updatedPerformanceAPI = `${API_URL}/pblprfr?service=${SERVICE_KEY}&stdate=${
      dateObj.start
    }&eddate=${
      dateObj.end
    }&cpage=${page++}&rows=${100}&shcate=${CLASSIC}&afterdate=${dateObj.after}`;
    const performanceArrayByPage = await getPerformanceItemsInPage(
      updatedPerformanceAPI
    );

    if (!performanceArrayByPage) {
      break;
    } else {
      for (const item of performanceArrayByPage) {
        updatedPerformancesIdArray.push(item.mt20id._text);
      }
    }

    await new Promise((r) => {
      // 초당 10회 호출 제한
      setTimeout(r, 100);
    });
  }

  console.log(updatedPerformancesIdArray);
  return updatedPerformancesIdArray;
};

const upsertUpdatedDataToDB = async (dateObj: {
  after: string;
  start: string;
  end: string;
}) => {
  const updatedPerformancesIdArray = await getUpdatedPerformancesId(dateObj);
  console.log("updated performances:", updatedPerformancesIdArray);
  for (const pfId of updatedPerformancesIdArray) {
    const performanceDetail = await getPerformanceDetail(pfId);
    await importPerformanceDetailToDB(performanceDetail[0]);
    if (performanceDetail[1] < 4000) {
      await new Promise((r) => setTimeout(r, 4000 - performanceDetail[1]));
    }
  }
};

// 스케줄러 함수에서 오류가 발생하여 DB에 다량의 데이터를 업데이트해야 하는 경우 실행하는 함수 (DB에서 오래된 데이터 삭제 + DB에 새로운 데이터 추가)
const refreshDBData = async () => {
  const newPerformanceItemArray = await getNewPerformanceItems(); // 향후 3개월간의 모든 공연
  const newPfIdArray = newPerformanceItemArray.map(
    (element) => element.mt20id._text
  ); // 공연id로 이루어진 배열

  const newPfIdSet = new Set(newPfIdArray); // 삭제할 공연의 pfId를 효율적으로 찾기 위해 Set 자료구조 활용
  const oldPfIdArray = await getOldPfIdArray(); // 기존 DB에 존재하는 공연들의 pfId로 이루어진 배열
  const oldPfIdSet = new Set(oldPfIdArray);

  await deleteOldDataInDB(newPfIdSet, oldPfIdArray);
  await addNewDataToDB(oldPfIdSet, newPfIdArray);

  // 특정 날짜 이후로 수정/등록된 공연 데이터 upsert
  const dateObj = {
    after: "20251011",
    start: "20251011",
    end: "20250109",
  };
  await upsertUpdatedDataToDB(dateObj);
};

// 대상 기간(TARGET_PERIOD)의 모든 공연 데이터를 DB performance_list 테이블에 삽입하는 함수
const importPerformanceDataToDB = async () => {
  const stDate = now.format("YYYYMMDD");
  const edDate = now.add(90, "day").format("YYYYMMDD");

  let page = 1;
  while (true) {
    console.log(`page: ${page}`);
    const performanceAPI = `${API_URL}/pblprfr?service=${SERVICE_KEY}&stdate=${stDate}&eddate=${edDate}&cpage=${page++}&rows=${100}&shcate=${CLASSIC}`;
    const performanceArrayByPage = await getPerformanceItemsInPage(
      performanceAPI
    );

    if (!performanceArrayByPage) {
      break;
    } else {
      for (const item of performanceArrayByPage) {
        try {
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

          if (performanceDetail[1] < 4000) {
            await new Promise((r) => {
              setTimeout(() => {
                r(1);
              }, 4000 - performanceDetail[1]);
            });
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  }
};

// (async () => {
//   await refreshDBData();
// })();
