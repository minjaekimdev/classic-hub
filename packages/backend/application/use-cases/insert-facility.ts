import { API_URL, SERVICE_KEY } from "@/infrastructure/external-api/kopis";
import convert, { ElementCompact } from "xml-js";
import { removeTextProperty } from "../services/preprocessing";
import { Facility, FacilitySummary } from "@/models/kopis";
import { insertData } from "@/infrastructure/database";
import { APIError, withErrorHandling } from "utils/error";
import { DBFacility, DBHall } from "@/models/supabase";
import RateLimiter from "utils/rateLimiter";

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
    seat_count: Number(facility.seatscale),
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
    seat_count: Number(hall.seatscale),
    has_orchestra_pit: hall.stageorchat === "Y",
    has_practice_room: hall.stagepracat === "Y",
    has_dressing_room: hall.stagedresat === "Y",
    has_outdoor_stage: hall.stageoutdrat === "Y",
    disabled_seat_count: Number(hall.disabledseatscale),
    disabled_stage_area: hall.stagearea,
    facility_id: facility.mt10id,
  }));

  // PK가 존재하는 facilities 데이터가 먼저 삽입되어야 함(halls FK -> facilities PK)
  await insertData("facilities", DBfaciltyData, "id");
  await insertData("halls", DBhallData, "id");
};

// 공연시설 상세 조회
const getFacilityDetail = async (mt10id: string) => {
  return withErrorHandling(async () => {
    const response: ElementCompact = await fetch(
      `${API_URL}/prfplc/${mt10id}?service=${SERVICE_KEY}`
    );

    if (!response.ok) {
      throw new APIError(
        `FacilityDetail API call failed: ${response.status}`,
        response.status,
      );
    }

    const xmlText = await response.text();
    const parsedData: ElementCompact = convert.xml2js(xmlText, {
      compact: true,
    });

    const result = removeTextProperty(parsedData.dbs.db);
    return result as unknown as Facility;
  }, null);
};

// 공연시설 목록 조회
const getFacilityAndInsertToDB = async () => {
  let page = 28;

  while (true) {
    console.log(`page: ${page}`);

    const response: ElementCompact = await KOPISrateLimiter.execute(() =>
      fetch(`${API_URL}/prfplc?service=${SERVICE_KEY}&cpage=${page++}&rows=100`)
    );

    if (!response.ok) {
      throw new APIError(
        `page API call failed: ${response.status}`,
        response.status,
      );
    }

    const xmlText = await response.text();
    const parsedData: ElementCompact = convert.xml2js(xmlText, {
      compact: true,
    });

    // 배열로 구성된 공연장 목록 데이터(전처리 이전)
    const rawArray = parsedData.dbs.db;
    if (!rawArray) break;

    // 데이터가 1개일 때 객체로 오는 경우 방어 코드
    const facilityList = Array.isArray(rawArray) ? rawArray : [rawArray];

    await Promise.all(
      facilityList.map(async (item: any) => {
        // 목록에서는 아직 _text가 남아있으므로 ._text로 접근
        const mt10id = item.mt10id._text;

        const facility = await KOPISrateLimiter.execute(() =>
          getFacilityDetail(mt10id)
        );

        // null 체크: facility가 null이 아닐 때만 저장
        if (facility) {
          await insertFacilityToDB(facility);
        }
      })
    );
  }
};

const KOPISrateLimiter = new RateLimiter(100);
getFacilityAndInsertToDB();
