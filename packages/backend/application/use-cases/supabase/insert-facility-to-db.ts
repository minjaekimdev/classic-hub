import { insertData } from "@/infrastructure/database";
import { Facility } from "@/models/kopis";
import { DBFacility } from "@classic-hub/shared/types/database";
import { withErrorHandling } from "utils/error";
import logger from "utils/logger";

// 공연장은 facilities 테이블에, 세부 공연장은 halls 테이블에 저장
const insertFacilityToDB = async (facilityDetail: Facility) => {
  const { mt13s, ...facility } = facilityDetail;

  // 1. API 데이터 -> DB 데이터 매핑
  const DBfaciltyData: DBFacility = {
    // 기본 정보 매핑
    id: facility.mt10id,
    name: facility.fcltynm,
    opening_year: facility.opende,
    facility_type: facility.fcltychartr,

    // 숫자 변환 (String -> Number)
    hall_count: Number(facility.mt13cnt),
    seat_count: Number(facility.seatscale?.replaceAll(",", "")),
    latitude: Number(facility.la),
    longitude: Number(facility.lo),

    // 문자열 정보
    tel: facility.telno,
    url: facility.relateurl,
    adress: facility.adres, // (참고: 인터페이스에 adress로 되어 있어 그대로 둠)

    // 편의시설 여부 변환 ("Y" | "N" -> boolean)
    has_restaurant: facility.restaurant === "Y",
    has_cafe: facility.cafe === "Y",
    has_store: facility.store === "Y",
    has_nolibang: facility.nolibang === "Y",
    has_suyu: facility.suyu === "Y",
    has_parking: facility.parkinglot === "Y",

    // 장애인 편의시설 여부 변환
    has_disabled_parking: facility.parkbarrier === "Y",
    has_disabled_restroom: facility.restbarrier === "Y",
    has_disabled_ramp: facility.runwbarrier === "Y",
    has_disabled_elevator: facility.elevbarrier === "Y",
  };

  const rawData = mt13s?.mt13;
  const hallList = !rawData ? [] : Array.isArray(rawData) ? rawData : [rawData];

  const DBhallData = hallList.map((hall) => ({
    id: hall.mt13id,
    name: hall.prfplcnm,
    seat_count: Number(hall.seatscale?.replaceAll(",", "")),
    has_orchestra_pit: hall.stageorchat === "Y",
    has_practice_room: hall.stagepracat === "Y",
    has_dressing_room: hall.stagedresat === "Y",
    has_outdoor_stage: hall.stageoutdrat === "Y",
    disabled_seat_count: Number(hall.disabledseatscale?.replaceAll(",", "")),
    disabled_stage_area: hall.stagearea,
    facility_id: facility.mt10id,
  }));

  // PK가 존재하는 facilities 데이터가 먼저 삽입되어야 함(halls FK -> facilities PK)
  await withErrorHandling(
    async () => {
      await insertData("facilities", DBfaciltyData, "id");
      await insertData("halls", DBhallData, "id");
    },
    () => {
      logger.warn(
        `[INSERT_FAIL] facility detail insert failed: ${facility.mt10id}`,
      );
    },
  );
};

export default insertFacilityToDB;
