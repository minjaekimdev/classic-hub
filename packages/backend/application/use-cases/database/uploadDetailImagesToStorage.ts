import { STORAGE_NAME } from "@/application/constants";
import { uploadToStorage } from "@/infrastructure/external-api/supabase/storage";
import { withErrorHandling } from "@/shared/utils/error";
import { fileTypeFromBuffer } from "file-type";

export const uploadDetailImagesToStorage = (
  id: string,
  detailBuffers: Array<Buffer>,
) => {
  return withErrorHandling(
    async () => {
      const storageDetailUrls = await Promise.all(
        detailBuffers.map(async (buf, idx) => {
          const type = await fileTypeFromBuffer(buf);
          const extension = type?.ext ?? "jpg";
          const contentType = type?.mime ?? "image/jpg";

          return await uploadToStorage(
            STORAGE_NAME,
            `${id}/detail_${idx}_${Date.now()}.${extension}`,
            buf,
            {
              contentType,
              upsert: true,
            },
          );
        }),
      );

      return storageDetailUrls;
    },
    null,
    "supabase",
  );
};
