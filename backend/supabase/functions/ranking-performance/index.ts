import supabase from "../_shared/supabaseClient.ts";
import { API_URL, CLASSIC, SERVICE_KEY } from "../_shared/kopisClient.ts";
import dayjs from "npm:dayjs";
import convert, { ElementCompact } from "npm:xml-js";
import {
  RankingPeriod,
  RankingItem,
  pfIdObject,
} from "../_shared/types/ranking.d.ts";
import type { PerformanceDetailType } from "../_shared/types/detail.d.ts";
import getProgramJSON from "../_shared/get-program.ts";
import type { ProgramArray } from "../_shared/get-program.ts";

// 랭킹 데이터 업데이트
const getRankingAPI = (period: RankingPeriod) => {
  let stDate = "";
  const endDate = dayjs().subtract(1, "day");

  if (period === "daily") {
    stDate = endDate.format("YYYYMMDD");
  } else if (period === "weekly") {
    stDate = endDate.clone().subtract(1, "week").format("YYYYMMDD");
  } else if (period === "monthly") {
    stDate = endDate.clone().subtract(1, "month").format("YYYYMMDD");
  }

  const rankingAPI = `${API_URL}/boxoffice?service=${SERVICE_KEY}&stdate=${stDate}&eddate=${endDate.format(
    "YYYYMMDD"
  )}&catecode=${CLASSIC}`;

  return rankingAPI;
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

const getRankingData = async (period: RankingPeriod): Promise<JsonArray> => {
  let rankingItemArray: JsonArray = [];

  try {
    const response: ElementCompact = await fetch(getRankingAPI(period))
      .then((res) => res.text())
      .then((data) => convert.xml2js(data, { compact: true }));

    rankingItemArray = removeTextProperty(response.boxofs.boxof) as JsonArray;
  } catch (error) {
    console.log("KOPIS API로 공연 랭킹 데이터 가져오기 실패: ", error);
  }

  return rankingItemArray;
};

export const importRankingData = async (period: RankingPeriod) => {
  const RankingItemArray = await getRankingData(period);
  let tableName = "";

  if (period === "daily") {
    tableName = "daily_ranking";
  } else if (period === "weekly") {
    tableName = "weekly_ranking";
  } else if (period === "monthly") {
    tableName = "monthly_ranking";
  }

  const { error } = await supabase.from(tableName).insert(RankingItemArray);

  if (error) {
    console.log("DB에 랭킹 데이터 삽입 실패: ", error);
  } else {
    console.log("DB에 랭킹 데이터 삽입 성공");
  }
};

export const deleteRankingData = async (
  period: RankingPeriod
): Promise<void> => {
  const { data, error } = await supabase
    .from(`${period}_ranking`)
    .delete()
    .not("id", "is", null); // 모든 행 삭제

  if (error) {
    console.log("랭킹 데이터 삭제 실패: ", error);
  } else {
    console.log("랭킹 데이터 삭제 성공: ", data);
  }
};

// DB performance_list 테이블에서 mt20id로 구성된 배열 리턴하기
const returnPfIdArrayFromDB = async (
  tableName: string,
  columnName: string
): Promise<string[]> => {
  const { data, error } = await supabase.from(tableName).select(columnName);

  if (error) {
    console.log(error);
    return [];
  } else {
    return data.map((element: { [key: string]: any }) => element[columnName]);
  }
};

const importPerformanceDetailToDB = async (pfDetail: PerformanceDetailType) => {
  const { error } = await supabase.from("performance_list").insert(pfDetail); // performance_list에 존재하지 않음을 확인 후 삽입하는 것이므로 insert

  if (error) {
    console.log("performance_list에 공연 데이터 삽입 실패", error);
  } else {
    console.log("performance_list에 공연 데이터 삽입 성공");
  }
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

const getRankingPerformanceDetail = async (
  pfId: string
): Promise<PerformanceDetailType> => {
  const detailAPI = `${API_URL}/pblprfr/${pfId}?service=${SERVICE_KEY}`;
  let pfDetail: PerformanceDetailType = {};

  try {
    const response: ElementCompact = await fetch(detailAPI)
      .then((res) => res.text())
      .then((data) => convert.xml2js(data, { compact: true }));

    pfDetail = removeTextProperty(response.dbs.db) as PerformanceDetailType;
  } catch (error) {
    console.log("KOPIS API로 공연 상세 데이터 받아오기 실패", error);
  }

  // 상세이미지 url로부터 프로그램 데이터 추출
  if (pfDetail?.styurls) {
    const programData = await getProgramJSON(pfDetail.styurls.styurl);
    const normalizedProgram = normalizeProgramData(programData);
    pfDetail.program = normalizedProgram;
  }

  return pfDetail; // Gemini API RPM(Request Per Minute)제한 맞추기 위해 시간 차이를 함께 리턴
};

const importRankingPfDetail = async (period: RankingPeriod) => {
  const rankingPfIdArray = await returnPfIdArrayFromDB(
    `${period}_ranking`,
    "mt20id"
  );
  const performanceListPfIdArray = await returnPfIdArrayFromDB(
    "performance_list",
    "mt20id"
  );
  const performanceListPfIdArraySet = new Set(performanceListPfIdArray);
  const idsToImport = rankingPfIdArray.filter(
    (element) => !performanceListPfIdArraySet.has(element)
  );

  console.log(`${period}_ranking idsToImport: ${idsToImport}`);

  for (const id of idsToImport) {
    const t1 = performance.now();
    const performanceDetail = await getRankingPerformanceDetail(id);
    await importPerformanceDetailToDB(performanceDetail);
    const t2 = performance.now();

    if (t2 - t1 < 4000) {
      await new Promise((r) => {
        setTimeout(() => {
          r(1);
        }, 4000 - (t2 - t1));
      });
    }
  }
};

export const updateAllRankingData = async () => {
  // 기존 랭킹 데이터 삭제
  await Promise.all([
    deleteRankingData("daily"),
    deleteRankingData("weekly"),
    deleteRankingData("monthly"),
  ]);

  // 새로운 랭킹 데이터 추가
  await importRankingData("daily");
  await new Promise((r) => {
    setTimeout(r, 100);
  });
  await importRankingData("weekly");
  await new Promise((r) => {
    setTimeout(r, 100);
  });
  await importRankingData("monthly");
  await new Promise((r) => {
    setTimeout(r, 100);
  });

  // performance_list 테이블에 랭킹 데이터에 해당하는 공연 상세 데이터 추가
  await importRankingPfDetail("daily");
  await importRankingPfDetail("weekly");
  await importRankingPfDetail("monthly");
};

Deno.test("Updating ranking list", async () => {
  await updateAllRankingData();
});
