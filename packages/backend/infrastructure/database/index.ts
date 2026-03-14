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
  // 1. 모든 파일(하위 폴더 포함)의 전체 경로를 가져오는 헬퍼 함수
  const getAllFiles = async (path: string = ""): Promise<string[]> => {
    const { data, error } = await supabase.storage.from(bucket).list(path);
    if (error) throw error;
    if (!data) return [];

    let files: string[] = [];

    for (const item of data) {
      const fullPath = path ? `${path}/${item.name}` : item.name;

      // id가 있으면 파일, 없으면 폴더로 간주 (Supabase 특성)
      if (item.id) {
        files.push(fullPath);
      } else {
        // 폴더인 경우 재귀적으로 내부 파일 탐색
        const subFiles = await getAllFiles(fullPath);
        files = [...files, ...subFiles];
      }
    }
    return files;
  };

  try {
    const allFilePaths = await getAllFiles();

    if (allFilePaths.length === 0) {
      console.log("삭제할 파일이 없습니다.");
      return;
    }

    // console.log(`삭제 시도 경로: ${allFilePaths}`);
    console.log(`filesToDelete: ${allFilePaths}`);

    // 2. 찾아낸 모든 '파일' 경로로 삭제 실행
    const { data, error: removeError } = await supabase.storage
      .from(bucket)
      .remove(allFilePaths);
 
    if (removeError) throw removeError;

    console.log(`data: ${data}`);
    console.log(`error: ${removeError}`)
    logger.info("Storage bucket cleared successfully", {
      bucket,
      count: allFilePaths.length,
    });
  } catch (error: any) {
    throw new APIError(`[CLEAR_STORAGE_FAIL] ${error.message}`);
  }
};

export const getStorageFiles = async (
  bucketName: string,
  path: string = "",
) => {
  const { data, error } = await supabase.storage.from(bucketName).list(path); // path가 빈 문자열이면 루트(폴더) 목록을 가져옵니다.

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
