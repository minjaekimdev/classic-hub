// full path로부터 storage 이름 이후의 경로를 추출하는 함수
export const getStoragePath = (path: string | undefined | null) => {
  if (!path) return null;

  const pathGroups = path.split("performances/");
  return pathGroups.length > 1 ? pathGroups[1] : null;
};

// 응답을 생성하여 반환하는 함수
export const getResponse = (data: object, status = 200) => {
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
    status,
  });
};