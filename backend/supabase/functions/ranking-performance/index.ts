import supabase from "../_shared/supabaseClient.ts";
import { API_URL, CLASSIC, SERVICE_KEY } from "../_shared/kopisClient.ts";
import dayjs from "npm:dayjs";
import convert, { ElementCompact } from "npm:xml-js";
import { RankingPeriod } from "../_shared/types.d.ts";
import type { PerformanceDetailType } from "../_shared/types.d.ts";
import getProgramJSON from "../_shared/get-program.ts";
import { JsonArray, removeTextProperty, normalizeProgramData } from "../_shared/preprocessing.ts";

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

  const { error } = await supabase.from(tableName).upsert(RankingItemArray);

  if (error) {
    console.log("DB에 랭킹 데이터 삽입 실패: ", error);
  } else {
    console.log("DB에 랭킹 데이터 삽입 성공");
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

Deno.serve(async (_req) => {  
  try {
    // 메인 로직 실행
    await updateAllRankingData();

    return new Response(
      JSON.stringify({ message: "Ranking data updated successfully." }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) { 
    console.error("Error updating ranking data:", error);

    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { "Content-Type": "application/json" },
        status: 500,
      });
    }

    // Error 객체가 아닌 다른 것이 throw된 경우를 대비
    return new Response(JSON.stringify({ error: "An unexpected error occurred" }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
