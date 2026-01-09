import { PerformanceDetail, PerformanceSummary } from "@/models/kopis";
import supabase from "../external-api/supabase";
import logger from "utils/logger";

// 하나의 데이터를 DB에 추가하는 함수
const importPerformanceDetailToDB = async (pfDetail: PerformanceDetail) => {
  const { error } = await supabase
    .from("performance_list")
    .upsert(pfDetail, { onConflict: "mt20id" }); // 중복의 기준을 PK인 공연코드(mt20id)로 정함, 중복된다면 덮어씌우기

  if (error) {
    console.log("performance_list에 공연 데이터 삽입 실패", error);
  } else {
    console.log("performance_list에 공연 데이터 삽입 성공");
  }
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

// 특정 공연 데이터 삭제
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

// 하나의 데이터를 DB에 삽입
export const insert = async <T>(table: string, data: T, onConflict: string) => {
  const { error } = await supabase.from(table).upsert(data, { onConflict }); // 중복의 기준을 PK인 공연코드(mt20id)로 정함, 중복된다면 덮어씌우기
  
  if (error) {
    logger.error("data insert 실패", {
      error,
      service: "supabase",
    });
  } else {
    logger.info("data insert 성공", {
      service: "supabase",
      table,
      data,
    });
  }
}

// 여러 데이터(배열)를 한 번에 DB에 삽입
export const bulkInsert = async <T>(
  table: string,
  data: Array<T>,
  onConflict: string
) => {
  const { error } = await supabase.from(table).upsert(data, { onConflict }); // 중복의 기준을 PK인 공연코드(mt20id)로 정함, 중복된다면 덮어씌우기

  if (error) {
    logger.error("bulk insert 실패", {
      error,
      service: "supabase",
    });
  } else {
    logger.info("bulk insert 성공", {
      service: "supabase",
      table,
      count: data.length,
    });
  }
};
