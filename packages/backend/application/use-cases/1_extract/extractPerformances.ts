import logger from "@/shared/utils/logger";
import { compareNewOld } from "./domain/compareNewOld";
import { getPerformanceIds } from "./flows/getPerformanceIds";
import { getPerformanceList } from "./flows/getPerformanceList";
import { getColumnData } from "@/infrastructure/supabase/database";
import { deletePerformances } from "./infra/deletePerformances";

export const extractPerformances = async (
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
  // TODO: 삭제는 extractPerformances에서 직접 수행하지 않고, 삭제할 명단을 다음 단계로 전달하는 편이 좋을것같다.
  // extract이라는 이름에 위배되고, 여기서 발생한 에러로 인해 다른 extract 기능이 수행되지 않을 우려가 있기 때문
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
  const idsToTransform = [...new Set([...idsToInsert, ...idsToUpdate])];
  logger.info("[PROCESS] 가공해야 할 공연 id:", idsToTransform);

  // 6) id를 바탕으로 공연 상세 데이터 가져오기
  logger.info("[PROCESS] 공연 상세 데이터 가져오기");
  const performances = await getPerformanceList(idsToTransform);
  // TODO: getPerformanceWithBuffer를 이쪽에서 호출하여 한번에 버퍼 처리를 한다.

  return {
    performancesToTransform,
    idsToDelete,
  };
};
