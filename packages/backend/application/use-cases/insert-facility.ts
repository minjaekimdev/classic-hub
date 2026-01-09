import { API_URL, SERVICE_KEY } from "@/infrastructure/external-api/kopis";
import convert, { ElementCompact } from "xml-js";
import withErrorHandling from "utils/logger";
import { removeTextProperty } from "../services/preprocessing";
import { JsonValue } from "../services/preprocessing";
import { FacilityDetail, FacilitySummary } from "@/models/kopis";
import { insert } from "@/infrastructure/database";

const insertFacilityToDB = async (facilityDetail: FacilityDetail) => {
  // 공연장은 facilities 테이블에, 세부 공연장은 halls 테이블에 저장
  const {mt13s, ...facility} = facilityDetail;

  await insert("facilities", facility, "mt10id");
  
};

// 공연시설 상세 조회
const getFacilityDetail = async (mt10id: string) => {
  const response: ElementCompact = await fetch(
    `${API_URL}/prfplc/${mt10id}?service=${SERVICE_KEY}`
  )
    .then((res) => res.text())
    .then((data) => convert.xml2js(data, { compact: true }));
  
  const facilityDetail: FacilityDetail = response.dbs.db;
  insertFacilityToDB(facilityDetail);
};

// 공연시설 목록 조회
const getFacilitySummary = async () => {
  let page = 1;

  while (true) {
    const response: ElementCompact = await fetch(
      `${API_URL}/prfplc?service=${SERVICE_KEY}&cpage=${page++}&rows=10`
    )
      .then((res) => res.text())
      .then((data) => convert.xml2js(data, { compact: true }));

    // 배열로 구성된 공연장 목록 데이터(전처리 이전)
    const rawArray = response.dbs.db;

    // 전처리
    const processedArray = rawArray.map((facility: JsonValue) =>
      removeTextProperty(facility)
    );

    processedArray.map((item: FacilitySummary) => getFacility(item.mt10id));
  }
};

getFacilities();
