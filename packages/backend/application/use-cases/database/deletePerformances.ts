import { deleteData } from "@/infrastructure/database";
import { withErrorHandling } from "shared/utils/error";
import logger from "shared/utils/logger";
import { sendSlackNotification } from "shared/utils/monitor";

export const deletePerformances = async (ids: string[]) => {
  await withErrorHandling(
    async () => {
      await deleteData("performances", "performance_id", ids);
    },
    // 삭제에 실패한 경우만 슬랙 알림 전송
    async () => {
      logger.error("[DELETE_FAIL] data delete Failed", {
        service: "supabase",
      });
      await sendSlackNotification("❌ [DELETE_FAIL] data delete Failed");
    },
  );
};
