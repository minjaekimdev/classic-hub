import { supabaseAdmin } from "./client.ts";

// Edge Function의 HTTP 응답을 JSON으로 만든다.
export const getResponse = (
  body: Record<string, unknown>,
  status = 200,
): Response => {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
};

// Storage에서 파일 경로 배열을 삭제한다.
// 실패 시 에러를 그대로 던진다 — task-worker의 Promise.allSettled가
// 개별 실패를 잡아 재시도 큐에 기록하는 구조다.
export const deleteFromStorage = async (
  bucket: string,
  paths: string[],
): Promise<void> => {
  const { error } = await supabaseAdmin.storage.from(bucket).remove(paths);

  if (error) {
    throw new Error(`Storage delete failed: ${error.message}`);
  }
};
