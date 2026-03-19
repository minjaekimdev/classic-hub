import { deleteData } from "@/infrastructure/external-api/supabase/database";
import logger from "shared/utils/logger";
import { sendSlackNotification } from "shared/utils/monitor";

export const deletePerformances = async (ids: string[]) => {
  try {
    await deleteData("performances", "performance_id", ids);
  } catch (error) {
    logger.error("[DELETE_FAIL] data delete Failed", {
      service: "supabase",
    });
    await sendSlackNotification("❌ [DELETE_FAIL] data delete Failed");
  }
};
