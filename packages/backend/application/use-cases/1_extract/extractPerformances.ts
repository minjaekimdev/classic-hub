import { PerformanceDetail } from "@/shared/types/kopis";

interface Dependencies {
  getDbPerformanceIds: (table: string, column: string) => Promise<string[]>;
  compareNewOld: (
    newIds: string[],
    dbIds: string[],
  ) => {
    idsToDelete: string[];
    idsToInsert: string[];
  };
  getAllPerformanceIdList: (
    startDate: string,
    endDate: string,
    afterDate?: string,
  ) => Promise<string[]>;
  getPerformanceDetailList: (ids: string[]) => Promise<PerformanceDetail[]>;
  log: {
    info: (msg: string) => void;
  };
}

// extractPerformances 자체는 1회만 재시도한다.
export const createExtractPerformances = ({
  getDbPerformanceIds,
  compareNewOld,
  getAllPerformanceIdList,
  getPerformanceDetailList,
  log,
}: Dependencies) => {
  return async (
    startDate: string,
    endDate: string,
    afterDate: string,
    updateEndDate: string,
  ) => {
    // 로그를 현재 단계, KOPIS페칭, DB관련 로직 등등에 따라 각각 PROCESS, KOPIS, DB로 분류
    log.info(
      `[PROCESS] 새로운 공연 데이터 동기화 시작 (대상 기간: ${startDate} ~ ${endDate})`,
    );

    // 1) 새로운 데이터를 페칭
    // 내부에서 3회 재시도 했는데도 전체 페이지를 가져오지 못했다면 에러 발생 후 상위로 throw
    const newIds = await getAllPerformanceIdList(startDate, endDate);
    log.info(`[KOPIS_SUCCESS] 새로운 공연 ID 개수: ${newIds.length}`);

    // 2) 비교를 위해 DB에 있는 기존 데이터 페칭
    // 에러 발생 시 상위로 throw
    const dbIds = await getDbPerformanceIds("performances", "performance_id");
    log.info(`[DB_SUCCESS] DB에 존재하는 공연 ID 개수: ${dbIds.length}`);

    // 3) 기존 데이터와 새로운 데이터를 비교하여 삭제할 데이터와 삽입할 데이터의 id를 가져오기
    // 에러 발생 시 상위로 throw
    log.info("[PROCESS] DB에 존재하는 공연 ID와 새로운 공연 ID 비교");
    const { idsToDelete, idsToInsert } = compareNewOld(newIds, dbIds);

    // 4) 기존에 저장된 공연둘 중 수정된 공연의 id 가져오기
    log.info("[PROCESS] DB에 있는 기존 공연들 중 수정된 공연 id 가져오기");
    const idsToUpdate = await getAllPerformanceIdList(
      startDate,
      updateEndDate,
      afterDate,
    );

    // 5) 변환(Transform) 단계에 투입할 데이터를 골라낸다.
    // isToUpdate와 isToInsert에 동일한 id를 가진 데이터가 존재할 수 있으므로 set으로 중복을 제외한다.
    const idsToTransform = [...new Set([...idsToInsert, ...idsToUpdate])];
    log.info(`[PROCESS] 가공해야 할 최종 공연 개수: ${idsToTransform.length}`);

    // 6) id를 바탕으로 공연 상세 데이터만 먼저 가져오기
    log.info("[PROCESS] 공연 상세 데이터 추출 시작");
    const performances = await getPerformanceDetailList(idsToTransform);

    // 이미지 버퍼는 transform 단계에서 공연 1건 단위로 페칭한다. (중복 페칭 제거)
    // 삭제해야할 공연 id만 전달하고, 실제 삭제는 뒤로 미룬다.
    return {
      performances,
      idsToDelete,
    };
  };
};
