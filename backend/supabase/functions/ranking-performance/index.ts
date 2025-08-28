import supabase from "../_shared/supabaseClient.ts";
import { apiURL, classic, serviceKey } from "../_shared/kopisClient.ts";
import dayjs from "https://esm.sh/dayjs";
import convert, { ElementCompact } from "https://esm.sh/xml-js";
import { RankingPeriod, RankingItem, pfIdObject } from "../_shared/types/ranking.d.ts";

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

  const rankingAPI = `${apiURL}/boxoffice?service=${serviceKey}&stdate=${stDate}&eddate=${endDate.format(
    "YYYYMMDD"
  )}&catecode=${classic}`;

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

const importRankingItem = async (item: any, table: string): Promise<void> => {
  const { error } = await supabase.from(table).insert(item);

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
  const detailAPI = `${apiURL}/pblprfr/${pfId}?service=${serviceKey}`;

  const response: ElementCompact = await fetch(detailAPI)
    .then((res) => res.text())
    .then((data) => convert.xml2js(data, { compact: true }));

  console.log(response);
  const pfDetail = response.dbs.db;

  const { error } = await supabase.from("performance_list").insert(pfDetail);

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
    await Promise.all(
      RankingPfIdArray.map(async (element) => {
        await getRankingPfDetailAndImport(element.mt20id._text);
      })
    );
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
  await Promise.all([
    deleteRankingData("daily"),
    deleteRankingData("weekly"),
    deleteRankingData("monthly"),
  ]);
  await Promise.all([
    importRankingData("daily"),
    importRankingData("weekly"),
    importRankingData("monthly"),
  ]);
  await Promise.all([
    importRankingPfDetail("daily"),
    importRankingPfDetail("weekly"),
    importRankingPfDetail("monthly"),
  ]);
  await Promise.all([
    addTicketlinkToRankingData("daily"),
    addTicketlinkToRankingData("weekly"),
    addTicketlinkToRankingData("monthly"),
  ]);
};

Deno.test("Refreshing ranking performance test", async () => {
  await refreshAllRankingData();
})