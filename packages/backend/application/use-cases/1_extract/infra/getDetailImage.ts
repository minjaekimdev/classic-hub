import { APIError } from "shared/utils/error";

const getDetailImage = async (url: string): Promise<ArrayBuffer> => {
  // 실패 시 에러를 그대로 던진다. 로깅/폴백 정책은 상위에서 담당.
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
