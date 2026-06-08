import logger from "@/shared/utils/logger";
import { mapExternalToInternal } from "./mappers/mapExternalToInternal";
import { PerformanceDetail } from "@/shared/types/kopis";

interface ImageTarget {
  id: string;
  posterUrl: string;
  detailImageUrls: string[];
}

interface ImagebuffersResult {
  id: string;
  posterBuffer: Buffer | null;
  detailImageBuffers: Buffer[];
}

interface Dependencies {
  getColumnData: (table: string, column: string) => Promise<string[]>;
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
  getPerformanceImageBuffers: (
    target: ImageTarget,
  ) => Promise<ImagebuffersResult>;
}

export const createExtractPerformances = ({
  getColumnData,
  compareNewOld,
  getAllPerformanceIdList,
  getPerformanceDetailList,
  getPerformanceImageBuffers,
}: Dependencies) => {
  return async (
    startDate: string,
    endDate: string,
    afterDate: string,
    updateEndDate: string,
  ) => {
    // 로그를 현재 단계, KOPIS페칭, DB관련 로직 등등에 따라 각각 PROCESS, KOPIS, DB로 분류
    logger.info(
      `[PROCESS] 새로운 공연 데이터 동기화 시작 (대상 기간: ${startDate} ~ ${endDate})`,
    );

    // 1) 새로운 데이터를 페칭
    const newIds = await getAllPerformanceIdList(startDate, endDate);
    logger.info("[KOPIS] 새로운 공연 ID 개수:", newIds.length);

    // 2) 비교를 위해 DB에 있는 기존 데이터 페칭
    const dbIds = await getColumnData("performances", "performance_id");
    logger.info("[DB] DB에 존재하는 공연 ID 개수:", dbIds.length);

    // 3) 기존 데이터와 새로운 데이터를 비교하여 삭제할 데이터와 삽입할 데이터의 id를 가져오기
    logger.info("[PROCESS] DB에 존재하는 공연 ID와 새로운 공연 ID 비교");
    const { idsToDelete, idsToInsert } = compareNewOld(newIds, dbIds);

    // 4) 기존에 저장된 공연둘 중 수정된 공연의 id 가져오기
    logger.info("[PROCESS] DB에 있는 기존 공연들 중 수정된 공연 id 가져오기");
    const idsToUpdate = await getAllPerformanceIdList(
      startDate,
      updateEndDate,
      afterDate,
    );

    // 5) isToUpdate와 isToInsert에 동일한 id를 가진 데이터가 존재할 수 있으므로 set으로 중복 제외
    const idsToTransform = [...new Set([...idsToInsert, ...idsToUpdate])];
    logger.info("[PROCESS] 가공해야 할 최종 공연 개수:", idsToTransform.length);

    // 6) id를 바탕으로 공연 상세 데이터만 먼저 가져오기
    logger.info("[PROCESS] 공연 상세 데이터 추출 시작");
    const rawPerformances = await getPerformanceDetailList(idsToTransform);

    // 7) 이미지 url만 순수하게 뽑아내기 (껍질 까기)
    const imageTargets = rawPerformances.map((rawData) => {
      const detailImageUrls = rawData.styurls?.styurl || [];
      const detailImageUrlList = Array.isArray(detailImageUrls)
        ? detailImageUrls
        : [detailImageUrls];

      return {
        id: rawData.mt20id,
        posterUrl: rawData.poster, // null일 수도 있음
        detailImageUrls: detailImageUrlList,
      };
    });

    // 8) Promise.all을 사용하여 병렬로 안전하게 버퍼 데이터 가져오기
    // 에러 발생 시 posterBuffer는 null, detailImageBuffers는 빈 배열로 반환된다.
    logger.info("[PROCESS] 이미지 URL 바탕으로 버퍼 데이터 병렬 페칭 시작");
    const datasWithImageBuffer = await Promise.all(
      imageTargets.map((target) => getPerformanceImageBuffers(target)),
    );

    // 9) 로그 타이밍 최적화
    logger.info(
      "[PROCESS] 2단계: 가져온 데이터를 바탕으로 이미지 버퍼 및 최종 리스트 가공 시작",
    );

    // 10) 오케스트레이터에서 안전하게 1:1 매칭하며 매퍼 호출하기
    // datasWithImageBuffer에 id가 들어있으므로, 안전하게 ID 기반으로 매칭합니다.
    const bufferMap = new Map(
      datasWithImageBuffer.filter((item) => item).map((b) => [b.id, b]),
    );

    const performances = rawPerformances.map((rawData) => {
      const targetBuffer = bufferMap.get(rawData.mt20id);

      if (targetBuffer === undefined) {
        return null;
      }

      // 개별 데이터 단위로 순수하게 매핑 함수 호출
      return mapExternalToInternal(
        rawData,
        targetBuffer.posterBuffer,
        targetBuffer.detailImageBuffers || [],
      );
    });

    // 삭제해야할 공연 id만 전달하고, 실제 삭제는 뒤로 미룬다.
    return {
      performances,
      idsToDelete,
    };
  };
};
