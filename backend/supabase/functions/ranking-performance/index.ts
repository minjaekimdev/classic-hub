import supabase from "../_shared/supabaseClient.ts";
import { API_URL, CLASSIC, SERVICE_KEY } from "../_shared/kopisClient.ts";
import dayjs from "https://esm.sh/dayjs";
import convert, { ElementCompact } from "https://esm.sh/xml-js";
import {
  RankingPeriod,
  RankingItem,
  pfIdObject,
} from "../_shared/types/ranking.d.ts";

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

const getRankingData = async (
  period: RankingPeriod
): Promise<RankingItem[]> => {
  let rankingItemArray = [];

  try {
    const response: ElementCompact = await fetch(getRankingAPI(period))
      .then((res) => res.text())
      .then((data) => convert.xml2js(data, { compact: true }));

    rankingItemArray = response.boxofs.boxof;
  } catch (error) {
    console.log("KOPIS API로 공연 랭킹 데이터 가져오기 실패: ", error);
  }

  return rankingItemArray;
};

const importRankingItem = async (
  item: object,
  table: string
): Promise<void> => {
  const { error } = await supabase.from(table).insert(item);

  console.log(`rankingItem:
    ${JSON.stringify(item)}
    `);

  if (error) {
    console.log("DB에 랭킹 데이터 삽입 실패: ", error);
  } else {
    console.log("DB에 랭킹 데이터 삽입 성공");
  }
};

export const importRankingData = async (
  period: RankingPeriod
): Promise<void> => {
  const RankingItemArray = await getRankingData(period);
  let tableName = "";

  if (period === "daily") {
    tableName = "daily_ranking";
  } else if (period === "weekly") {
    tableName = "weekly_ranking";
  } else if (period === "monthly") {
    tableName = "monthly_ranking";
  }

  await Promise.all(
    RankingItemArray.map(
      async (element) => await importRankingItem(element, tableName)
    )
  );

  // 초당 10회 호출 제한
  await new Promise((r) => {
    setTimeout(r, 100);
  });
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

// 랭킹 공연 상세 데이터 업데이트
const returnPfIdArray = async (
  period: RankingPeriod
): Promise<pfIdObject[] | undefined> => {
  const { data, error } = await supabase
    .from(`${period}_ranking`)
    .select("mt20id");

  if (error) {
    console.log(error);
  } else {
    return data;
  }
};

const getRankingPfDetailAndImport = async (pfId: string): Promise<void> => {
  const detailAPI = `${API_URL}/pblprfr/${pfId}?service=${SERVICE_KEY}`;

  const response: ElementCompact = await fetch(detailAPI)
    .then((res) => res.text())
    .then((data) => convert.xml2js(data, { compact: true }));

  const pfDetail = response.dbs.db;

  console.log(`pfDetail:
    ${JSON.stringify(pfDetail)}
    `);
  const { error } = await supabase.from("performance_list").upsert(pfDetail);
  if (error) {
    console.log("랭킹 상세 데이터 삽입 실패: ", error);
  } else {
    console.log("랭킹 상세 데이터 삽입 성공");
  }
};

export const importRankingPfDetail = async (
  period: RankingPeriod
): Promise<void> => {
  const RankingPfIdArray = await returnPfIdArray(period);

  if (!RankingPfIdArray) {
    console.log("DB _ranking 에서 랭킹 공연 id로 이루어진 배열 가져오기 실패");
  } else {
    for (const item of RankingPfIdArray) {
      await getRankingPfDetailAndImport(item.mt20id._text);
      // 초당 10회 호출 제한
      await new Promise((r) => {
        setTimeout(r, 100);
      });
    }
  }
};

// 예매처 링크 랭킹 데이터에 추가
const addTicketlinkToRankingItem = async (
  element: pfIdObject,
  period: RankingPeriod
): Promise<void> => {
  const pfId = element.mt20id; // TextNode 형태
  const tableName = `${period}_ranking`;

  // 테이블에서 해당 공연의 ticketlink (또는 relates 등) 값 가져오기
  const { data, error } = await supabase
    .from("performance_list")
    .select()
    .eq("mt20id", JSON.stringify(pfId))
    .limit(1)
    .single();

  if (error || !data) {
    console.error("DB performance_list에서 예매처 링크 가져오기 실패", error);
  } else {
    const { error } = await supabase
      .from(tableName)
      .update({ relates: data.relates })
      .eq("mt20id", JSON.stringify(pfId));

    if (error) {
      console.error("DB _ranking에 예매처 링크 삽입 실패", error);
    } else {
      console.log("DB _ranking에 예매처 링크 삽입 성공");
    }
  }
};

export const addTicketlinkToRankingData = async (
  period: RankingPeriod
): Promise<void> => {
  const { data, error } = await supabase
    .from(`${period}_ranking`)
    .select("mt20id");

  if (error) {
    console.log(
      `예매처 링크 삽입을 위해 DB ${period}_ranking 데이터 불러오기 실패`
    );
  } else {
    await Promise.all(
      data.map(async (element) => {
        await addTicketlinkToRankingItem(element, period);
      })
    );
  }
};

export const refreshAllRankingData = async () => {
  // 기존 랭킹 데이터 삭제
  await Promise.all([
    deleteRankingData("daily"),
    deleteRankingData("weekly"),
    deleteRankingData("monthly"),
  ]);

  // 새로운 랭킹 데이터 추가
  await importRankingData("daily");
  await importRankingData("weekly");
  await importRankingData("monthly");

  // 랭킹 테이블에 공연 데이터 추가
  await importRankingPfDetail("daily");
  await importRankingPfDetail("weekly");
  await importRankingPfDetail("monthly");

  // 예매처 링크를 DB의 랭킹 테이블에 추가
  await Promise.all([
    addTicketlinkToRankingData("daily"),
    addTicketlinkToRankingData("weekly"),
    addTicketlinkToRankingData("monthly"),
  ]);
};

// Deno.test("Refreshing ranking performance test", async () => {
//   await refreshAllRankingData();
// });
