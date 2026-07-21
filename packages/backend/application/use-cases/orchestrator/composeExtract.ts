// 컴포지션 루트: 실제 인프라 구현체를 주입해서 '실제' use-case 함수를 생성한다.
// 앱 전체에서 create* 팩토리를 직접 부르지 않고 이곳에서 만든 함수를 사용한다.
import { kopisRateLimiter } from "@/application/services/kopisRateLimiter";
import { sendSlackNotification } from "@/shared/utils/monitor";
import logger from "@/shared/utils/logger";
import { kopisService } from "@/infrastructure/kopis/service";
import { getColumnData } from "@/infrastructure/supabase/database";
import { imageFetcher } from "@/infrastructure/kopis/utils/image-fetcher";
import { createGetPerformanceIdsInPage } from "../1_extract/infra/getPerformanceIdsInPage";
import { createGetDbPerformanceIds } from "../1_extract/infra/getDbPerformanceIds";
import { createGetAllPerformanceIdList } from "../1_extract/flows/getAllPerformanceIdList";
import { createGetPerformanceDetailList } from "../1_extract/flows/getPerformanceDetailList";
import { createGetPerformanceImageBuffers } from "../1_extract/flows/getPerformanceImageBuffers";
import { compareNewOld } from "../1_extract/flows/compareNewOld";
import { createExtractPerformances } from "../1_extract/extractPerformances";

// KOPIS에서 한 페이지의 id를 가져오는 실제 구현 (withErrorHandling 래핑 포함)
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

// 4) 포스터/상세 이미지 url로 버퍼 데이터 반환
const getPerformanceImageBuffers = createGetPerformanceImageBuffers({
  imageFetcher,
  log: logger,
});

// 최상위 use-case: extractPerformances 조립
export const extractPerformances = createExtractPerformances({
  getDbPerformanceIds,
  compareNewOld,
  getAllPerformanceIdList,
  getPerformanceDetailList,
  getPerformanceImageBuffers,
  log: logger,
});
