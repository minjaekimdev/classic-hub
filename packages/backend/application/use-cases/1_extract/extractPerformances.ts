import logger from "@/shared/utils/logger";
import { Dayjs } from "dayjs";
import { compareNewOld } from "./modules/compareNewOld";
import { getPerformanceIds } from "./modules/getPerformanceIds";
import { getPerformanceList } from "./modules/getPerformanceList";
import { deleteOldPerformances } from "./modules/deleteOldPerformances";

export const extractPerformances = async (
  now: Dayjs,
  startDate: string,
  endDate: string,
  afterDate: string,
  updateEndDate: string,
) => {
  logger.info(
    `Fetching new performance datas at ${now.format("YYYYMMDD")} (target period: ${startDate} ~ ${endDate})`,
  );
  // 1) 새로운 데이터를 페칭
  const newPerformanceIds = await getPerformanceIds(startDate, endDate);

  // 2) DB와 새로운 데이터를 비교하여 삭제할 데이터와 삽입할 데이터의 id를 가져오기
  logger.info("Comparing new datas with DB...");
  const { idsToDelete, idsToInsert } = await compareNewOld(newPerformanceIds);

  // 3) 데이터 삭제
  logger.info("Deleting old performance datas...");
  await deleteOldPerformances(idsToDelete);

  // 어제 이후 업데이트된 공연 데이터 가져오기
  logger.info("Fetching updated datas...");
  const idsToUpdate = await getPerformanceIds(
    startDate,
    updateEndDate,
    afterDate,
  );

  // isToUpdate와 isToInsert에 동일한 id를 가진 데이터가 존재할 수 있으므로 set으로 제외
  const idsToProcess = [...new Set([...idsToInsert, ...idsToUpdate])];

  logger.info("Fetching Performance Details...");

  return getPerformanceList(idsToProcess);
};
