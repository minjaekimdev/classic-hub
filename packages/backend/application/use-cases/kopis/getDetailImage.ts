import { APIError } from "shared/utils/error";

const getDetailImage = async (url: string): Promise<ArrayBuffer> => {
  // Promise.all에서 활용해야 하므로 withErrorHandling 사용 X. (상위에서 에러 로깅)
  const response = await fetch(url);

  if (!response.ok) {
    throw new APIError(
      `[FETCH_FAIL] Detail Image fetch failed: ${response.status}`,
      response.status,
    );
  }

  return await response.arrayBuffer();
};

export default getDetailImage;
