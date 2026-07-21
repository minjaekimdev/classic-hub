type imageFetcherFn = (url: string, message: string) => Promise<Buffer>;

// 모든 사이드 이펙트(imageFetcher, log)를 주입하여
// 테스트에서 vi.mock 없이 결정적(deterministic)으로 검증할 수 있다.
export interface GetPerformanceImageBuffersDeps {
  imageFetcher: imageFetcherFn;
  log: {
    error: (msg: string) => void;
  };
}

interface ImageTarget {
  id: string;
  posterUrl: string;
  detailImageUrls: string[];
}

// 포스터 url과 상세이미지 url을 통해 이미지를 다운로드 후 버퍼 데이터를 반환
// url이 존재할 때만 다운로드를 시도하고, 하나라도 터지면 null을 반환한다.
export const createGetPerformanceImageBuffers = ({
  imageFetcher,
  log,
}: GetPerformanceImageBuffersDeps) => {
  return async ({ id, posterUrl, detailImageUrls }: ImageTarget) => {
    try {
      const posterBuffer = posterUrl
        ? await imageFetcher(
            posterUrl,
            `[KOPIS_FAIL] 포스터 이미지 버퍼 가져오기 실패 (ID: ${id})`,
          )
        : null;
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
      log.error(`[IMAGE_FAIL] 이미지 다운로드 실패 (ID: ${id})`);

      // TODO: 재시도는 extract, transform, load 각 단계별로 수행하는 것이 올바름
      // 따라서 failureCollector로직 추가 시 별도 단계별로 모으고, 추후 최종본을 합치는게 좋을 것 같다.

      // 에러 시 빈 버퍼나 null을 반환하여 다음 과정이 진행되도록
      return null;
    }
  };
};
