import { APIError } from "utils/error";
import supabase from "../external-api/supabase";
import logger from "utils/logger";

// DB 테이블에 존재하는 데이터의 값만을 배열로 반환
// ex) [ {mt20id: PF1234}, ... ] -> [ PF1234, ... ]
export const getColumnData = async (
  table: string,
  column: string
): Promise<string[]> => {
  const { data, error } = await supabase.from(table).select(column);

  if (error) {
    throw new APIError(`DB fetch failed: ${error.message}`);
  } else {
    return data.map((element: Record<string, any>) => element.column);
  }
};

// 데이터 삭제
export const deleteData = async <T>(
  table: string,
  column: string,
  data: Array<T>
) => {
  const { error } = await supabase.from(table).delete().in(column, data);

  if (error) {
    throw new APIError(`DB delete failed: ${error.message}`);
  } else {
    logger.info("DB delete succeeded", {
      service: "supabase",
      table,
    });
  }
};

// 데이터를 DB에 삽입
export const insertData = async <T>(
  table: string,
  data: T,
  onConflict: string
) => {
  const { error } = await supabase.from(table).upsert(data, { onConflict });

  if (error) {
    throw new APIError(`DB insert failed: ${error.message}`);
  } else {
    logger.info("DB insert succeeded", {
      service: "supabase",
      table,
    });
  }
};

export const callDatabaseFunction = async <T>(fnName: string, args?: T) => {
  const { error } = await supabase.rpc(fnName, args);

  if (error) {
    throw new APIError(`RPC Failed: ${error.message}`);
  } else {
    logger.info("DB RPC succeeded", {
      service: "supabase",
      fnName,
    });
  }
};
