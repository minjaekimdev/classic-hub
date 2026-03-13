import supabase from "../external-api/supabase";
import { APIError } from "../../shared/utils/error";
import logger from "../../shared/utils/logger";
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

export const getRowsByCondition = async <T>(
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

// storage에 저장
export const uploadToStorage = async (
  bucket: string,
  path: string,
  file: Buffer | Blob,
  options = { contentType: "image/webp", upsert: true },
): Promise<string> => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, options);

  if (error) {
    throw new APIError(`Storage Upload Failed: ${error.message}`);
  }

  logger.info("Storage upload succeeded", {
    service: "supabase",
    bucket,
    path,
  });

  // 업로드 성공 후 즉시 Public URL 반환
  // 입력한 path와 실제 저장된 path가 달라질 수도 있는 엣지 케이스가 생길 수 있으므로(예: 파일명 중복 처리 등)
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(data.path);

  return publicUrl;
};

export const clearStorage = async (bucket: string) => {
  // 1. 버킷 안의 모든 파일 목록 가져오기
  const { data: files, error: listError } = await supabase.storage
    .from(bucket)
    .list();

  if (listError) {
    throw new APIError(
      `[DELETE_FAIL] Storage DELETE Failed: ${listError.message}`,
    );
  }
  if (!files || files.length === 0) return;

  // 2. 파일 이름만 추출해서 배열로 만들기
  const filesToRemove = files.map((file) => file.name);

  // 3. 일괄 삭제 (삭제할 파일이 많으면 나눠서 처리해야 할 수도 있음)
  const { error: removeError } = await supabase.storage
    .from(bucket)
    .remove(filesToRemove);

  if (removeError) {
    throw new APIError(
      `[DELETE_FAIL] Storage DELETE Failed: ${removeError.message}`,
    );
  }

  if (removeError) throw removeError;
  logger.info("Storage delete succeeded", {
    service: "supabase",
    bucket,
  });
};

export const getStorageFiles = async (
  bucketName: string,
  path: string = "",
) => {
  const { data, error } = await supabase.storage.from(bucketName).list(path); // path가 빈 문자열이면 루트 목록을 가져옵니다.

  if (error) {
    throw new APIError(
      `[FETCH_FAIL] Storage File Fetch Failed: ${error.message}`,
    );
  }

  logger.info("Storage File Fetch Succeeded", {
    service: "supabase",
  });

  // 파일들의 이름(name)만 추출해서 배열로 반환
  return data.map((file) => file.name);
};
