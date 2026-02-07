import { deleteData } from "@/infrastructure/database";
import { withErrorHandling } from "utils/error";
import logger from "utils/logger";
import { sendSlackNotification } from "utils/monitor";

const deletePerformances = async (ids: string[]) => {
  await withErrorHandling(
    async () => {
      await deleteData("performances", "performance_id", ids);
      logger.info(`[DELETE_SUCCESS] data delete succeeded`, {
        service: "supabase",
      });
      await sendSlackNotification("✅ [DELETE_SUCCESS] data delete succeeded");
    },
    async () => {
      logger.error("[DELETE_FAIL] data delete Failed", {
        service: "supabase",
      });
      await sendSlackNotification("❌ [DELETE_FAIL] data delete Failed");
    },
  );
};

export default deletePerformances;
