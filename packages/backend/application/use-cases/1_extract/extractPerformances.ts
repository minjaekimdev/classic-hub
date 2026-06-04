import logger from "@/shared/utils/logger";
import { Dayjs } from "dayjs";
import { compareNewOld } from "./modules/compareNewOld";
import { getPerformanceIds } from "./modules/getPerformanceIds";
import { getPerformanceList } from "./modules/getPerformanceList";
import { getColumnData } from "@/infrastructure/supabase/database";
import { deletePerformances } from "./modules/deletePerformances";

export const extractPerformances = async (
  now: Dayjs,
  startDate: string,
  endDate: string,
  afterDate: string,
  updateEndDate: string,
) => {
  // 로그를 현재 단계, KOPIS페칭, DB관련 로직에 따라 각각 PROCESS, KOPIS, DB로 분류
  logger.info(
    `[PROCESS] 새로운 공연 데이터 동기화 시작 (대상 기간: ${startDate} ~ ${endDate})`,
  );
  // 1) 새로운 데이터를 페칭
  const newIds = await getPerformanceIds(startDate, endDate);
  logger.info("[KOPIS] 새로운 공연 ID:", newIds);

  const dbIds = await getColumnData("performances", "performance_id");
  logger.info("[DB] DB에 존재하는 공연 ID:", dbIds);

  // 2) DB와 새로운 데이터를 비교하여 삭제할 데이터와 삽입할 데이터의 id를 가져오기
  logger.info("[PROCESS] DB에 존재하는 공연 ID와 새로운 공연 ID 비교");
  const { idsToDelete, idsToInsert } = compareNewOld(newIds, dbIds);

  // 3) 데이터 삭제
  logger.info("[PROCESS] DB에 있는 오래된 공연 데이터 삭제");
  if (idsToDelete.length > 0) {
    logger.info(`[DB] 삭제할 데이터 개수: ${idsToDelete.length}개`);
    // 내부에서 fallback 로직 실행
    // TODO: deletePerformances같이 extract에서만 활용하는 db함수의 경우 1_extract에 응집해도 좋을 것 같다.
    // supabase에서 가져오는 함수는 extract에서만 활용하기 때문
    await deletePerformances(idsToDelete);
  } else {
    logger.info("[DB] 삭제할 데이터가 없음");
  }

  // 4) 기존에 저장된 공연둘 중 수정된 공연의 id 가져오기
  logger.info("[PROCESS] DB에 있는 기존 공연들 중 수정된 공연 id 가져오기");
  const idsToUpdate = await getPerformanceIds(
    startDate,
    updateEndDate,
    afterDate,
  );

  // 5) isToUpdate와 isToInsert에 동일한 id를 가진 데이터가 존재할 수 있으므로 set으로 제외
  const idsToProcess = [...new Set([...idsToInsert, ...idsToUpdate])];
  logger.info("[PROCESS] 가공해야 할 공연 id:", idsToProcess);

  // 6) id를 바탕으로 공연 상세 데이터 가져오기
  logger.info("[PROCESS] 공연 상세 데이터 가져오기");
  return getPerformanceList(idsToProcess);
};
