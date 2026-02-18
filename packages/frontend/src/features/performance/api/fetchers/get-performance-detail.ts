import supabase from "@/app/api/supabase-client";
import mapToPerformanceDetail from "../mappers/performance-detail.mapper";
import type { DBPerformanceRow } from "@classic-hub/shared/types/database";

const getPerformanceDetail = async (id: string) => {
  const { error, data } = await supabase
    .from("performances")
    .select("*")
    .eq("performance_id", id);

  if (error) {
    console.log("[FETCH_FAIL] 공연 상세 데이터 가져오기 실패");
  } else {
    return mapToPerformanceDetail(data[0] as unknown as DBPerformanceRow);
  }
};

export default getPerformanceDetail;
