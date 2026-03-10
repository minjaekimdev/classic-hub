import { withErrorHandling } from "shared/utils/error";
import getDetailImage from "./getDetailImage";

interface ImageBufferResult {
  posterBuffer: ArrayBuffer;
  detailBuffers: ArrayBuffer[];
}

const getImageBuffer = async (
  posterUrl: string,
  detailUrls: string[],
): Promise<ImageBufferResult | null> => {
  return withErrorHandling(
    async () => {
      const [posterBuffer, detailBuffers] = await Promise.all([
        getDetailImage(posterUrl),
        Promise.all(detailUrls.map((url) => getDetailImage(url))),
      ]);

      return { posterBuffer, detailBuffers };
    },
    null,
    "kopis",
  );
};

export default getImageBuffer;
