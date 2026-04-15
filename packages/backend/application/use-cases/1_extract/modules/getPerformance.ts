import { imageFetcher } from "@/shared/utils/imageFetcher";
import { mapExternalToInternal } from "../mappers/mapExternalToInternal";
import { getPerformanceDetail } from "./getPerformanceDetail";

// kopis API로 상세 데이터 페칭한 뒤, 포스터 URL과 상세이미지 URL을 바탕으로
// 버퍼 값을 받아와 객체에 매핑하여 반환하는 함수
export const getPerformance = async (id: string) => {
  // getPerformanceDetail 호출해서 상세 데이터 받아오기
  const rawData = await getPerformanceDetail(id);

  // 받아온 상세 데이터에서 포스터 이미지 및 상세 이미지 받아와서 객체에 저장하기
  const posterUrl = rawData.poster;

  const rawDetailImages = rawData.styurls;
  const detailImageUrls = Array.isArray(rawDetailImages)
    ? rawDetailImages
    : [rawDetailImages];

  const posterBuffer = await imageFetcher(
    posterUrl,
    `[FETCH_FAIL] Poster Image Fetch Failed (ID: ${id})`,
  );

  // detailImageUrl 호출하여 버퍼 값 가져오기
  const detailImageBuffers = await Promise.all(
    detailImageUrls.map(async (url) =>
      imageFetcher(url, `[FETCH_FAIL] Detail Image Fetch Failed (ID: ${id}))`),
    ),
  );

  return mapExternalToInternal(rawData, posterBuffer, detailImageBuffers);
};
