import { STORAGE_NAME } from "@/application/use-cases/3_load/constants";
import { uploadToStorage } from "@/infrastructure/supabase/storage";
import { fileTypeFromBuffer } from "file-type";

// 실패 시 에러를 그대로 던지며, null fallback 정책은 호출자(경계 계층)가 담당한다.
export const uploadDetailImagesToStorage = async (
  id: string,
  detailBuffers: Array<Buffer>,
): Promise<string[]> => {
  const storageDetailUrls = await Promise.all(
    detailBuffers.map(async (buf, idx) => {
      const type = await fileTypeFromBuffer(buf);
      const extension = type?.ext ?? "jpg";
      const contentType = type?.mime ?? "image/jpg";

      return await uploadToStorage(
        STORAGE_NAME,
        `${id}/detail_${idx}.${extension}`,
        buf,
        {
          contentType,
          upsert: true,
        },
      );
    }),
  );

  return storageDetailUrls;
};
