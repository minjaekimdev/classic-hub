import { withErrorHandling } from "utils/error";
import getDetailImage from "./getDetailImage";

const getImageBuffer = async (posterUrl: string, detailUrls: string[]) => {
  return withErrorHandling(async () => {
    const [posterBuffer, detailBuffers] = await Promise.all([
      getDetailImage(posterUrl),
      Promise.all(detailUrls.map((url) => getDetailImage(url))),
    ]);

    return { posterBuffer, detailBuffers };
  }, null, "kopis");
};

export default getImageBuffer;
