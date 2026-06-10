import { deleteData } from "@/infrastructure/supabase/database";
import logger from "shared/utils/logger";
import { sendSlackNotification } from "shared/utils/monitor";

export const deletePerformances = async (ids: string[]) => {
  try {
    await deleteData("performances", "performance_id", ids);
  } catch (error) {
    logger.error("[DB_FAIL] 공연 데이터 삭제 실패", {
      service: "supabase",
      table: "performances",
    });
    await sendSlackNotification("❌ [DB_FAIL] 공연 데이터 삭제 실패");
  }
};
