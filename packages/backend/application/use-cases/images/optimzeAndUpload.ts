import { uploadToStorage } from "@/infrastructure/database";
import sharp from "sharp";
import { withErrorHandling } from "shared/utils/error";
import { fileTypeFromBuffer } from "file-type";

interface OptimizeAndUploadResult {
  storagePosterUrl: string;
  storageDetailUrls: string[];
}
const optimizeAndUpload = async (
  id: string,
  posterBuffer: Buffer,
  detailBuffers: Array<Buffer>,
): Promise<OptimizeAndUploadResult | null> => {
  return withErrorHandling(
    async () => {
      const compressedPoster = await sharp(posterBuffer)
        .resize(300)
        .webp({ quality: 80 })
        .toBuffer();
      const storagePosterUrl = await uploadToStorage(
        "performances",
        // 파일 중복 및 브라우저 캐시 갱신을 위해 Date.now() 사용
        `${id}/poster_${Date.now()}.webp`,
        compressedPoster,
        { contentType: "image/webp", upsert: true },
      );

      // 상세 이미지들 압축 및 업로드 (병렬 처리)
      const storageDetailUrls = await Promise.all(
        detailBuffers.map(async (buf, idx) => {
          const type = await fileTypeFromBuffer(buf);
          const extension = type?.ext ?? "jpg";
          const contentType = type?.mime ?? "image/jpg";

          return await uploadToStorage(
            "performances",
            `${id}/detail_${idx}_${Date.now()}.${extension}`,
            buf,
            {
              contentType,
              upsert: true,
            },
          );
        }),
      );

      return { storagePosterUrl, storageDetailUrls };
    },
    null,
    "sharp",
  );
};

export default optimizeAndUpload;
