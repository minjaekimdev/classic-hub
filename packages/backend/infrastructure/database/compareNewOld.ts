import { APIError } from "@/shared/utils/error";
import { getColumnData } from ".";
import { sendSlackNotification } from "@/shared/utils/monitor";

export const compareNewOld = async (newPerformances: string[]) => {
  try {
    const dbPerformances = await getColumnData(
      "performances",
      "performance_id",
    );

    const newPerformancesSet = new Set(newPerformances);
    const dbPerformancesSet = new Set(dbPerformances);

    // DB에는 있지만 새 공연 데이터에는 없는 id -> 삭제 대상
    const idsToDelete = [...dbPerformances].filter(
      (id) => !newPerformancesSet.has(id),
    );
    // 새 공연 데이터에는 있지만 DB에는 없는 id -> 삽입 대상
    const idsToInsert = [...newPerformances].filter(
      (id) => !dbPerformancesSet.has(id),
    );

    return { idsToDelete, idsToInsert };
  } catch (error) {
    await sendSlackNotification("❌ [FETCH_FAIL] Old DB Data Fetch Failed")
    throw new APIError("[FETCH_FAIL] Old DB Data Fetch Failed");
  }
};
