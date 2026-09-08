import supabase from "./client";
import { APIError } from "../../shared/utils/error";
import logger from "../../shared/utils/logger";

// TODO: 이렇게 지정해 두는 것이 팩토리 함수에서 의존성 주입을 받기 편해진다?
// resetData에는 id가 굳이 전달되지 않더라도 전체를 리셋하는 방향이면 좋을것같다.
export interface IDatabaseService {
  // 지정한 테이블의 특정 컬럼 데이터들만 1차원 문자열 배열로 추출한다.
  getColumnData(table: string, column: string): Promise<string[]>;

  // 특정 컬럼의 값이 특수 조건(null, true, false 등)과 일치하는 행(Row)들을 조회한다.
  getRowsByIs<T>(table: string, column: string, value: T): Promise<any[]>;

  // 특정 컬럼의 값이 지정한 데이터와 정확히 일치(Equal)하는 행(Row)들을 조회한다.
  getRowsByEq<T>(table: string, column: string, value: T): Promise<any[]>;

  // 지정한 컬럼의 값이 주어진 배열 범위 내에 포함된 모든 데이터를 테이블에서 삭제한다.
  deleteData<T>(table: string, column: string, data: Array<T>): Promise<void>;

  // 특정 컬럼의 값이 존재(NOT NULL)하는 모든 데이터를 삭제하여 테이블을 초기화한다.
  resetData(table: string, id: string): Promise<void>;

  // 데이터를 테이블에 삽입하거나, 중복된 키가 존재할 경우 업데이트(Upsert)를 수행한다.
  insertData<T>(table: string, data: T, onConflict: string): Promise<void>;

  // 데이터베이스 내부의 RPC 또는 함수를 호출한다.
  callDatabaseFunction<T>(fnName: string, args?: T): Promise<void>;
}

// DB 테이블에 존재하는 데이터의 값만을 배열로 반환
// ex) [ {mt20id: PF1234}, ... ] -> [ PF1234, ... ]
export const getColumnData = async (
  table: string,
  column: string,
): Promise<string[]> => {
  const { data, error } = await supabase.from(table).select(column);

  if (error) {
    throw new APIError(`[FETCH_FAIL] DB Fetch Failed: ${error.message}`);
  }
  return data.map((element: Record<string, any>) => element[column]);
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
  }
  return data;
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
  }
  return data;
};

// 데이터 삭제
export const deleteData = async <T>(
  table: string,
  column: string,
  data: Array<T>,
) => {
  const { error } = await supabase.from(table).delete().in(column, data);

  if (error) {
    throw new APIError(`[DB_FAIL] DB 데이터 삭제 실패: ${error.message}`);
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
// TODO: 외부에서 callDatabaseFunction 호출 시 성공 상태 로깅을 해주어야 함
export const callDatabaseFunction = async <T>(fnName: string, args?: T) => {
  const { error } = await supabase.rpc(fnName, args);

  if (error) {
    throw new APIError(`RPC Failed: ${error.message}`);
  }
};
