import supabase from "../_shared/supabaseClient.ts";
import {
  apiURL,
  classic,
  serviceKey,
} from "../_shared/kopisClient.ts";
import dayjs from "https://esm.sh/dayjs";
import convert, { ElementCompact } from "https://esm.sh/xml-js";
import { TextNode } from "../_shared/types/common.d.ts";

const getPerformanceArrayByPage = async (
  performanceAPI: string
): Promise<
  | {
      mt20id: TextNode; // 공연 id
      prfnm: TextNode; // 공연명
      prfpdfrom: TextNode; // 공연시작일
      prfpdto: TextNode; // 공연종료일
      fcltynm: TextNode; // 공연장명
      poster: TextNode; // 포스터 URL
      area: TextNode; // 지역
      genrenm: TextNode; // 장르
      openrun: TextNode; // 오픈런여부
      prfstate: TextNode; // 공연상태
    }[]
  | null
> => {
  try {
    const response: ElementCompact = await fetch(performanceAPI)
      .then((res) => res.text())
      .then((data) => convert.xml2js(data, { compact: true }));

    const result = response.dbs.db;
    return result;
  } catch (error) {
    console.log("KOPIS API로 공연 데이터 받아오기 실패");
    return null;
  }
};

const getPerformanceDetail = async (pfId: string) => {
  const detailAPI = `${apiURL}/pblprfr/${pfId}?service=${serviceKey}`;

  try {
    const response: ElementCompact = await fetch(detailAPI)
      .then((res) => res.text())
      .then((data) => convert.xml2js(data, { compact: true }));

    const pfDetail = response.dbs.db;

    return pfDetail;
  } catch (error) {
    console.log("공연 상세 정보 받아오기 실패", error);
  }
};

const getAllPerformance = async (): Promise<TextNode[]> => {
  const stDate = dayjs().format("YYYYMMDD");
  const edDate = dayjs().add(90, "day").format("YYYYMMDD");
  const performanceIdArray = [];

  let page = 1;
  while (true) {
    const performanceAPI = `${apiURL}/pblprfr?service=${serviceKey}&stdate=${stDate}&eddate=${edDate}&cpage=${page++}&rows=${100}&shcate=${classic}`;
    const performanceArrayByPage = await getPerformanceArrayByPage(
      performanceAPI
    );

    if (!performanceArrayByPage) {
      break;
    } else {
      for (const item of performanceArrayByPage) {
        performanceIdArray.push(item.mt20id);
      }
    }
  }

  return performanceIdArray;
};

const getUpdatedPerformance = async () => {
  const today = dayjs();
  const updateStart = today.format("YYYYMMDD");
  const updateEnd = today.add(29, "day").format("YYYYMMDD");
  const newDate = today.add(30, "day").format("YYYYMMDD");

  const afterDate = dayjs().subtract(1, "day").format("YYYYMMDD");
  const performanceIdArray = [];

  let page = 1;

  // 기간 내 수정된 데이터 추가
  while (true) {
    const afterDate = today.subtract(1, "day").format("YYYYMMDD");
    const updatedPerformanceAPI = `${apiURL}/pblprfr?service=${serviceKey}&stdate=${updateStart}&eddate=${updateEnd}&cpage=${page++}&rows=${100}&shcate=${classic}&afterdate=${afterDate}`;
    const performanceArrayByPage = await getPerformanceArrayByPage(
      updatedPerformanceAPI
    );

    if (!performanceArrayByPage) {
      break;
    } else {
      for (const item of performanceArrayByPage) {
        performanceIdArray.push(item.mt20id);
      }
    }
  }

  // 3개월 뒤 공연 데이터 추가
  const newPerformanceAPI = `${apiURL}/pblprfr?service=${serviceKey}&stdate=${updateStart}&eddate=${updateEnd}&cpage=${page++}&rows=${100}&shcate=${classic}&afterdate=${afterDate}`;
  const newPerformanceArray = await getPerformanceArrayByPage(
    newPerformanceAPI
  );

  if (newPerformanceArray) {
    for (const item of newPerformanceArray) {
      performanceIdArray.push(item.mt20id);
    }
  }
};

const importPerformanceDetailToDB = async (pfDetail: object) => {
  const { error } = await supabase
    .from("performance_list")
    .upsert(pfDetail, { onConflict: "mt20id" });

  if (error) {
    console.log("performance_list에 3개월간 공연 데이터 삽입 실패", error);
  } else {
    console.log("performance_list에 3개월간 공연 데이터 삽입 성공");
  }
};

export const importPerformanceDataToDB = async () => {
  const performanceIdArray = await getAllPerformance();

  for (const item of performanceIdArray) {
    const performanceDetail = await getPerformanceDetail(item._text);
    importPerformanceDetailToDB(performanceDetail);
  }
};

importPerformanceDataToDB();
