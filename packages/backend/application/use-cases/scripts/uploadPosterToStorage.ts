import { STORAGE_NAME } from "@/application/use-cases/3_load/constants";
import { uploadToStorage } from "@/infrastructure/supabase/storage";

// 실패 시 에러를 그대로 던지며, null fallback 정책은 호출자(경계 계층)가 담당한다.
export const uploadPosterToStorage = async (
  id: string,
  compressedPoster: Buffer,
): Promise<string> => {
  const storagePosterUrl = await uploadToStorage(
    STORAGE_NAME,
    // 파일 중복 및 브라우저 캐시 갱신을 위해 Date.now() 사용
    `${id}/poster.webp`,
    compressedPoster,
    { contentType: "image/webp", upsert: true },
  );

  return storagePosterUrl;
};
