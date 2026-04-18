import logger from "@/shared/utils/logger";
import { deletePerformances } from "./deletePerformances";

// DB의 오래된 데이터를 삭제하는 로직 수행
export const deleteOldPerformances = async (ids: string[]) => {
  if (ids.length > 0) {
    console.log(`🚀 IDs to Delete: ${ids.length}`);

    // 내부에서 fallback 로직 실행
    await deletePerformances(ids);
  } else {
    logger.info("Nothing to Delete.");
  }
};
