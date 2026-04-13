import { APIError } from "@/shared/utils/error";
import logger from "@/shared/utils/logger";
import supabase from ".";

// storage에 저장
export const uploadToStorage = async (
  bucket: string,
  path: string,
  file: Buffer | ArrayBuffer,
  options: object,
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

  return `${publicUrl}?t=${Date.now()}`;
};

export const clearStorage = async (bucket: string, filePaths: string[]) => {
  try {
    // 2. 찾아낸 모든 '파일' 경로로 삭제 실행
    const { error: removeError } = await supabase.storage
      .from(bucket)
      .remove(filePaths);

    if (removeError) throw removeError;
    logger.info("Storage bucket cleared successfully", {
      bucket,
      count: filePaths.length,
    });
  } catch (error: any) {
    throw new APIError(`[CLEAR_STORAGE_FAIL] ${error.message}`);
  }
};

export const getStorageContentPaths = async (
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

  // 폴더 혹은 파일들의 이름(name)만 추출해서 배열로 반환
  return data.map((file) => file.name);
};
