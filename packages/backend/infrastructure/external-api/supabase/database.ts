import supabase from ".";
import { APIError } from "../../../shared/utils/error";
import logger from "../../../shared/utils/logger";
// DB 테이블에 존재하는 데이터의 값만을 배열로 반환
// ex) [ {mt20id: PF1234}, ... ] -> [ PF1234, ... ]
export const getColumnData = async (
  table: string,
  column: string,
): Promise<string[]> => {
  const { data, error } = await supabase.from(table).select(column);

  if (error) {
    throw new APIError(`[FETCH_FAIL] DB Fetch Failed: ${error.message}`);
  } else {
    return data.map((element: Record<string, any>) => element[column]);
  }
};

// 컬럼의 값이 null/true/false인지
export const getRowsByIs = async <T>(
  table: string,
  column: string,
  value: T,
) => {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .is(column, value);

  if (error) {
    throw new APIError(`DB Fetch Failed: ${error.message}`);
  } else {
    return data;
  }
};

// 컬럼의 값이 특정 값과 같은지
export const getRowsByEq = async <T>(
  table: string,
  column: string,
  value: T,
) => {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq(column, value);

  if (error) {
    throw new APIError(`DB Fetch Failed: ${error.message}`);
  } else {
    return data;
  }
};

// 데이터 삭제
export const deleteData = async <T>(
  table: string,
  column: string,
  data: Array<T>,
) => {
  const { error } = await supabase.from(table).delete().in(column, data);

  if (error) {
    throw new APIError(`DB Delete Failed: ${error.message}`);
  } else {
    logger.info("DB delete succeeded", {
      service: "supabase",
      table,
    });
  }
};

// 테이블의 모든 데이터 삭제
export const resetData = async (table: string, id: string) => {
  const { error } = await supabase.from(table).delete().not(id, "is", null);

  if (error) {
    throw new Error(`DB Reset Failed: ${error.message}`);
  }
};

// 데이터를 DB에 삽입
export const insertData = async <T>(
  table: string,
  data: T,
  onConflict: string,
) => {
  const { error } = await supabase.from(table).upsert(data, { onConflict });

  if (error) {
    throw new APIError(`DB insert failed: ${error.message}`);
  }
};

// rpc 호출
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
