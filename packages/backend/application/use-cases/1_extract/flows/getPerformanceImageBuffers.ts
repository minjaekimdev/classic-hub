import logger from "@/shared/utils/logger";
import { failureCollector } from "../../shared/failureCollector";

type imageFetcherFn = (url: string, messgage: string) => Promise<Buffer>;

interface Dependencies {
  imageFetcher: imageFetcherFn;
}

interface ImageTarget {
  id: string;
  posterUrl: string;
  detailImageUrls: string[];
}

// 포스터 url과 상세이미지 url을 통해 이미지를 다운로드 후 버퍼 데이터를 반환
// TODO: imageFetcher를 매개변수로 전달하는 이유는?
export const createGetPerformanceListWithImageBuffer = ({
  imageFetcher,
}: Dependencies) => {
  return async ({ id, posterUrl, detailImageUrls }: ImageTarget) => {
    try {
      const posterBuffer = await imageFetcher(
        posterUrl,
        `[KOPIS_FAIL] 포스터 이미지 버퍼 가져오기 실패 (ID: ${id}`,
      );
      const detailImageBuffers = await Promise.all(
        detailImageUrls.map((url: string) =>
          imageFetcher(
            url,
            `[KOPIS_FAIL] 상세 이미지 버퍼 가져오기 실패 (ID: ${id})`,
          ),
        ),
      );

      return {
        id,
        posterBuffer,
        detailImageBuffers,
      };
    } catch (error) {
      logger.error(`[IMAGE_FAIL] 이미지 다운로드 실패 (ID: ${id})`);

      // TODO: 재시도는 extract, transform, load 각 단계별로 수행하는 것이 올바름
      failureCollector.add(id, "EXTRACT", String(error));

      // 에러 시 빈 버퍼나 null을 반환하여 다음 공정이 진행되도록 방어벽 구축
      return { id, posterBuffer: null, detailImageBuffers: [] };
    }
  };
};
