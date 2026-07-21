import { mapExternalToInternal } from "../mappers/mapExternalToInternal";
import { InternalPerformance } from "../types";

interface Dependencies {
  getPerformanceDetail: (id: string) => Promise<any>;
  imageFetcher: (url: string, errorMessage: string) => Promise<Buffer>;
}

export const createGetPerformanceWithBuffer = ({
  getPerformanceDetail,
  imageFetcher,
}: Dependencies) => {
  return async (id: string): Promise<InternalPerformance> => {
    // 1) 주입받은 함수로 상세 데이터 받아오기
    const rawData = await getPerformanceDetail(id);

    // 2) 받아온 상세 데이터에서 포스터 이미지 URL 및 상세 이미지 URL 가져오기
    const posterUrl = rawData.poster;
    const rawDetailImages = rawData.styurls.styurl;
    const detailImageUrls = Array.isArray(rawDetailImages)
      ? rawDetailImages
      : [rawDetailImages];

    // 3) 주입받은 함수로 이미지 URL을 바탕으로 버퍼 데이터 가져오기
    const posterBuffer = await imageFetcher(
      posterUrl,
      `[FETCH_FAIL] Poster Image Fetch Failed (ID: ${id})`,
    );
    const detailImageBuffers = await Promise.all(
      detailImageUrls.map(
        async (url) =>
          imageFetcher(
            url,
            `[FETCH_FAIL] Detail Image Fetch Failed (ID: ${id})`,
          ),
      ),
    );

    return mapExternalToInternal(rawData, posterBuffer, detailImageBuffers);
  };
};
