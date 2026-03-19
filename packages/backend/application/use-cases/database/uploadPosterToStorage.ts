import { STORAGE_NAME } from "@/application/constants";
import { uploadToStorage } from "@/infrastructure/external-api/supabase/storage";
import { withErrorHandling } from "@/shared/utils/error";

export const uploadPosterToStorage = async (
  id: string,
  compressedPoster: Buffer,
) => {
  return withErrorHandling(
    async () => {
      const storagePosterUrl = await uploadToStorage(
        STORAGE_NAME,
        // 파일 중복 및 브라우저 캐시 갱신을 위해 Date.now() 사용
        `${id}/poster_${Date.now()}.webp`,
        compressedPoster,
        { contentType: "image/webp", upsert: true },
      );

      return storagePosterUrl;
    },
    null,
    "supabase",
  );
};
