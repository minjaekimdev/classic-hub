// 컴포지션 루트: 실제 인프라 구현체를 주입해서 '실제' use-case 함수를 생성한다.
// 앱 전체에서 create* 팩토리를 직접 부르지 않고 이곳에서 만든 함수를 사용한다.
import { kopisRateLimiter } from "@/application/services/kopisRateLimiter";
import { sendSlackNotification } from "@/shared/utils/monitor";
import logger from "@/shared/utils/logger";
import { kopisService } from "@/infrastructure/kopis/service";
import { getColumnData } from "@/infrastructure/supabase/database";
import { createGetPerformanceIdsInPage } from "./infra/getPerformanceIdsInPage";
import { createGetDbPerformanceIds } from "./infra/getDbPerformanceIds";
import { createGetAllPerformanceIdList } from "./flows/getAllPerformanceIdList";
import { createGetPerformanceDetailList } from "./flows/getPerformanceDetailList";
import { compareNewOld } from "./flows/compareNewOld";
import { createExtractPerformances } from "./extractPerformances";

// KOPIS에서 한 페이지의 id를 가져오는 실제 구현 (실패 시 에러를 던지며 재시도 정책은 flow가 담당)
const fetchPage = createGetPerformanceIdsInPage(kopisService);

// 1) 대상 기간동안의 새 공연 데이터 id 배열 리턴
const getAllPerformanceIdList = createGetAllPerformanceIdList({
  fetchPage,
  rateLimiter: kopisRateLimiter,
  notify: sendSlackNotification,
  log: logger,
  sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
});

// 2) DB에 존재하는 기존 공연 id 배열 리턴
const getDbPerformanceIds = createGetDbPerformanceIds({ getColumnData });

// 3) id별 공연 상세 데이터를 모아 반환
const getPerformanceDetailList = createGetPerformanceDetailList({
  getPerformanceDetail: (id) => kopisService.getPerformanceDetail(id),
  rateLimiter: kopisRateLimiter,
  log: logger,
});

// 최상위 use-case: extractPerformances 조립
export const extractPerformances = createExtractPerformances({
  getDbPerformanceIds,
  compareNewOld,
  getAllPerformanceIdList,
  getPerformanceDetailList,
  log: logger,
});
