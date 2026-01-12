import supabase from "../external-api/supabase";
import logger from "utils/logger";

// DB performance_list 테이블에 존재하는 공연id를 배열로 반환하는 함수
export const fetchColumnData = async (
  table: string,
  column: string
): Promise<string[]> => {
  const { data, error } = await supabase.from(table).select(column);

  if (error) {
    logger.error("column data fetch 실패", {
      error,
      service: "supabase",
    });
    return [];
  } else {
    return data.map((element: Record<string, any>) => element.mt20id);
  }
};

// 특정 공연 데이터 삭제
export const deleteData = async <T>(
  table: string,
  column: string,
  value: T
) => {
  const { error } = await supabase.from(table).delete().eq(column, value);

  if (error) {
    logger.error("data delete failed!", {
      error,
      service: "supabase",
    });
  } else {
    logger.info("data delete succeeded", {
      service: "supabase",
      table,
    });
  }
};

// 하나의 데이터를 DB에 삽입
export const insertData = async <T>(
  table: string,
  data: T,
  onConflict: string
) => {
  const { error } = await supabase.from(table).upsert(data, { onConflict });

  if (error) {
    logger.error("data insert failed!", {
      error,
      service: "supabase",
    });
  } else {
    logger.info("data insert succeeded", {
      service: "supabase",
      table,
    });
  }
};
