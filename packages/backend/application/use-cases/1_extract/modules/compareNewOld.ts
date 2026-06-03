export const compareNewOld = (newIds: string[], dbIds: string[]) => {
  const newIdsSet = new Set(newIds);
  const dbIdsSet = new Set(dbIds);

  // DB에는 있지만 새 공연 데이터에는 없는 id -> 삭제 대상
  const idsToDelete = [...dbIds].filter((id) => !newIdsSet.has(id));
  // 새 공연 데이터에는 있지만 DB에는 없는 id -> 삽입 대상
  const idsToInsert = [...newIds].filter((id) => !dbIdsSet.has(id));

  return { idsToDelete, idsToInsert };
};
