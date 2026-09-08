// 컴포지션 루트: 실제 인프라 구현체를 주입해서 '실제' use-case 함수를 생성한다.
// 앱 전체에서 create* 팩토리를 직접 부르지 않고 이곳에서 만든 함수를 사용한다.
import logger from "@/shared/utils/logger";
import { sendSlackNotification } from "@/shared/utils/monitor";
import { callDatabaseFunction } from "@/infrastructure/supabase/database";
import {
  saveFailuresToArtifact,
  FAILED_RECORDS_FILENAME,
} from "@/infrastructure/github/saveFailuresToArtifact";
import { retry } from "@/application/services/retry";
import { extractPerformances } from "../1_extract";
import { transformPerformances } from "../2_transform";
import { createSyncPerformanceData } from "./syncPerformances";

// 최상위 use-case: syncPerformanceData 조립
export const syncPerformanceData = createSyncPerformanceData({
  extractPerformances,
  transformPerformances,
  retry,
  insertPerformancesBulk: (payload) =>
    callDatabaseFunction("upsert_performances_bulk", { payload }),
  notify: sendSlackNotification,
  saveFailuresToArtifact,
  failedRecordsFilename: FAILED_RECORDS_FILENAME,
  log: logger,
});
