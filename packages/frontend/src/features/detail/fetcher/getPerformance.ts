import supabase from "@/app/api/supabase-client";
import mapToPerformanceDetail from "../mappers/mapToPerformanceDetail";
import type { DBPerformance } from "@classic-hub/shared/types/database";

const getPerformance = async (id: string) => {
  const { error, data } = await supabase
    .from("performances")
    .select("*")
    .eq("performance_id", id);

  if (error) {
    console.log("[FETCH_FAIL] 공연 상세 데이터 가져오기 실패");
  } else {
    return mapToPerformanceDetail(data[0] as unknown as DBPerformance);
  }
};

export default getPerformance;
