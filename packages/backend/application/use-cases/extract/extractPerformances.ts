import logger from "@/shared/utils/logger";
import RateLimiter from "@/shared/utils/rateLimiter";
import { Dayjs } from "dayjs";
import { compareNewOld } from "../database/compareNewOld";
import { getPerformanceIds } from "../fetchers/getPerformanceIds";
import { deletePerformances } from "../database/deletePerformances";
import { getPerformanceDetail } from "../fetchers/getPerformanceDetailArray";
import { RATE_LIMIT } from "@/application/constants";
import { failureCollector } from "../shared/failureCollector";

const kopisRateLimiter = new RateLimiter(RATE_LIMIT.KOPIS);

// DB의 오래된 데이터를 삭제하는 로직 수행
const deleteOldPerformances = async (ids: string[]) => {
  if (ids.length > 0) {
    console.log(`🚀 IDs to Delete: ${ids.length}`);

    // 내부에서 fallback 로직 실행
    await deletePerformances(ids);
  } else {
    logger.info("Nothing to Delete.");
  }
};

const getNewPerformances = async (ids: string[]) => {
  for (const id of ids) {
    const performanceDetail = await kopisRateLimiter.execute(() =>
      getPerformanceDetail(id),
    );

    if (!performanceDetail) {
      logger.error("[FETCH_FAIL] Performance fetch failed");
      failureCollector.add(id, "EXTRACT", );
      failedPerformances.push({
        id,
        error: "kopisFetchError",
      });
      continue;
    }
  }
};

// TODO: ETL 파이프라인에서 실패한 데이터를 모을 배열을 각 단계별 함수에 일일이 인자로 줘야 할까?
export const extractPerformances = async (
  now: Dayjs,
  startDate: string,
  endDate: string,
  afterDate: string,
  updateEndDate: string,
  kopisRateLimiter: RateLimiter,
) => {
  logger.info(
    `Fetching new performance datas at ${now.format("YYYYMMDD")} (target period: ${startDate} ~ ${endDate})`,
  );
  // 1) 새로운 데이터를 페칭
  const newPerformances = await getPerformanceIds(
    startDate,
    endDate,
    kopisRateLimiter,
  );

  // 2) DB와 새로운 데이터를 비교하여 삭제할 데이터와 삽입할 데이터의 id를 가져오기
  logger.info("Comparing new datas with DB...");
  const { idsToDelete, idsToInsert } = await compareNewOld(newPerformances);

  // 3) 데이터 삭제
  logger.info("Deleting old performance datas...");
  await deleteOldPerformances(idsToDelete);

  // 4) 데이터 삽입
  // 어제 이후 업데이트된 공연 데이터 가져오기
  logger.info("Fetching updated datas...");
  const idsToUpdate = await getPerformanceIds(
    startDate,
    updateEndDate,
    kopisRateLimiter,
    afterDate,
  );

  // isToUpdate와 isToInsert에 동일한 id를 가진 데이터가 존재할 수 있으므로 set으로 제외
  const idsToProcess = [...new Set([...idsToInsert, ...idsToUpdate])];

  logger.info("Fetching Performance Details...");
};
