import supabase from "../_shared/supabaseClient.ts";
import { API_URL, CLASSIC, SERVICE_KEY } from "../_shared/kopisClient.ts";
import dayjs from "npm:dayjs";
import convert, { ElementCompact } from "npm:xml-js";
import getProgramJSON from "../_shared/get-program.ts";
import type { PerformanceDetailType, TextNode } from "../_shared/types.d.ts";
import { removeTextProperty, normalizeProgramData } from "../_shared/preprocessing.ts";

const TARGET_PERIOD = 90;

const now = dayjs();
const yesterday = now.subtract(1, "day").format("YYYYMMDD");
const today = now.format("YYYYMMDD");
const updateEndDate = now.add(TARGET_PERIOD - 1, "day").format("YYYYMMDD");
const newDate = now.add(TARGET_PERIOD, "day").format("YYYY.MM.DD");

interface PerformanceItemType {
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
}

const getPerformanceItemsInPage = async (
  // 한 페이지의 공연 데이터(100개)를 배열로 반환
  performanceAPI: string
): Promise<PerformanceItemType[] | null> => {
  try {
    const response: ElementCompact = await fetch(performanceAPI)
      .then((res) => res.text())
      .then((data) => convert.xml2js(data, { compact: true }));

    const result = response.dbs.db;
    if (!result) {
      return null;
    }
    return Array.isArray(result) ? result : [result]; // result가 하나인 경우 단일 객체이므로 배열로 만들어주기
  } catch (error) {
    console.log("KOPIS API로 공연 데이터 받아오기 실패", error);
    return null;
  }
};

// pfId를 바탕으로 공연 상세 데이터를 받아오는 함수
const getPerformanceDetail = async (
  pfId: string
): Promise<[PerformanceDetailType, number]> => {
  const detailAPI = `${API_URL}/pblprfr/${pfId}?service=${SERVICE_KEY}`;
  let pfDetail: PerformanceDetailType = {};

  // 상세 데이터 호출
  try {
    const response: ElementCompact = await fetch(detailAPI)
      .then((res) => res.text())
      .then((data) => convert.xml2js(data, { compact: true }));

    pfDetail = removeTextProperty(response.dbs.db) as PerformanceDetailType;
  } catch (error) {
    console.log("KOPIS API로 공연 상세 데이터 받아오기 실패", error);
  }

  // 상세이미지 url로부터 프로그램 데이터 추출
  let [t1, t2] = [0, 0];
  if (pfDetail?.styurls) {
    t1 = performance.now();
    const programData = await getProgramJSON(pfDetail.styurls.styurl);
    t2 = performance.now();
    const normalizedProgram = normalizeProgramData(programData);
    pfDetail.program = normalizedProgram;
  }

  return [pfDetail, t2 - t1]; // Gemini API RPM(Request Per Minute)제한 맞추기 위해 시간 차이를 함께 리턴
};

// 향후 3개월간의 모든 공연 데이터를 받아오는 함수
const getNewPerformanceItems = async (): Promise<PerformanceItemType[]> => {
  const stDate = now.format("YYYYMMDD");
  const edDate = now.add(TARGET_PERIOD, "day").format("YYYYMMDD"); // 향후 3개월간의 공연들을 대상으로
  const performanceItemArray: PerformanceItemType[] = [];

  let page = 1;
  while (true) {
    const performanceAPI = `${API_URL}/pblprfr?service=${SERVICE_KEY}&stdate=${stDate}&eddate=${edDate}&cpage=${page++}&rows=${100}&shcate=${CLASSIC}`;
    const performanceItemArrayByPage = await getPerformanceItemsInPage(
      performanceAPI
    );

    if (!performanceItemArrayByPage) {
      break;
    } else {
      for (const item of performanceItemArrayByPage) {
        performanceItemArray.push(item);
      }
    }

    await new Promise((r) => {
      // 초당 10회 호출 제한
      setTimeout(r, 100);
    });
  }

  return performanceItemArray;
};

// afterdate 필드는 파라미터로 주어진 날짜 이후에 수정/추가된 공연 목록을 볼 수 있음
// 하루에 한 번 DB를 업데이트하므로 오늘부터 (3개월-1일)의 기간을 대상으로 afterdate={어제날짜}를 적용
const getUpdatedPerformancesId = async (): Promise<string[]> => {
  const updatedPerformancesIdArray = [];

  let page = 1;
  while (true) {
    const updatedPerformanceAPI = `${API_URL}/pblprfr?service=${SERVICE_KEY}&stdate=${today}&eddate=${updateEndDate}&cpage=${page++}&rows=${100}&shcate=${CLASSIC}&afterdate=${yesterday}`;
    const performanceArrayByPage = await getPerformanceItemsInPage(
      updatedPerformanceAPI
    );

    if (!performanceArrayByPage) {
      break;
    } else {
      for (const item of performanceArrayByPage) {
        updatedPerformancesIdArray.push(item.mt20id._text);
      }
    }

    await new Promise((r) => {
      // 초당 10회 호출 제한
      setTimeout(r, 100);
    });
  }

  console.log(updatedPerformancesIdArray);
  return updatedPerformancesIdArray;
};

const getOldPfIdArray = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from("performance_list")
    .select("mt20id");

  if (error) {
    console.log("performance_list table에서 mt20id 컬럼 가져오기 실패");
    return [];
  }
  return data.map((element: { mt20id: string }) => element.mt20id);
};

const deletePerformanceById = async (pfId: string) => {
  const { error } = await supabase
    .from("performance_list")
    .delete()
    .eq("mt20id", pfId);

  if (error) {
    console.log("DB performance_list에서 데이터 삭제 실패");
  } else {
    console.log("DB performance_list에서 데이터 삭제 성공");
  }
};

const importPerformanceToDB = async (pfDetail: PerformanceDetailType) => {
  const { error } = await supabase.from("performance_list").insert(pfDetail);

  if (error) {
    console.log("DB performance_list에 데이터 삽입 실패");
  } else {
    console.log("DB performance_list에 데이터 삽입 성공");
  }
};

const upsertUpdatedPerformancesToDB = async (pfDetail: PerformanceDetailType) => {
  const { error } = await supabase.from("performance_list").upsert(pfDetail);

  if (error) {
    console.log("DB performance_list에 어제 이후로 등록/수정된 데이터 upsert 실패");
  } else {
    console.log("DB performance_list에 어제 이후로 등록/수정된 데이터 upsert 성공");
  }
};

const updatePerformanceData = async () => {
  const newPerformanceItemArray = await getNewPerformanceItems(); // 향후 3개월간의 모든 공연
  console.log(newPerformanceItemArray);
  const newPfIdArray = newPerformanceItemArray.map(
    (element) => element.mt20id._text
  ); // 공연id로 이루어진 배열
  const newPfIdSet = new Set(newPfIdArray); // 삭제할 공연의 pfId를 효율적으로 찾기 위해 Set 자료구조 활용
  const oldPfIdArray = await getOldPfIdArray(); // 기존 DB에만 존재하고, newPerformanceItemArray에는 없는 공연의 pfId로 이루어진 배열

  // DB에서 오래된 공연 데이터(취소되어 삭제된 공연, 종료된 공연) 삭제
  const idsToDelete = oldPfIdArray.filter((pfId) => !newPfIdSet.has(pfId));
  console.log(idsToDelete);
  await Promise.all(
    idsToDelete.map(async (pfId) => {
      await deletePerformanceById(pfId);
    })
  );

  // 공연시작일이 (오늘+지정된기간)인 공연을 DB에 추가
  for (const item of newPerformanceItemArray) {
    if (item.prfpdfrom._text === newDate) {
      try {
        const performanceDetail = await Promise.race([
          new Promise<[PerformanceDetailType, number]>((_, reject) =>
            // 2분 이상 소요되면 다음 공연 데이터의 프로그램 받아오도록 실행
            setTimeout(() => {
              reject(new Error("Gemini API timed out after 120 seconds"));
            }, 120000)
          ),
          getPerformanceDetail(item.mt20id._text),
        ]);

        await importPerformanceToDB(performanceDetail[0]);

        // Gemini API 호출 시간 간격 맞추기
        if (performanceDetail[1] < 4000) {
          await new Promise((r) => {
            setTimeout(() => {
              r(1);
            }, 4000 - performanceDetail[1]);
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  // 어제 이후로 등록/수정된 공연 id 받아온 후 해당 공연 DB에 upsert
  const updatedPerformancesIdArray = await getUpdatedPerformancesId();
  for (const pfId of updatedPerformancesIdArray) {
    const performanceDetail = await getPerformanceDetail(pfId);
    await upsertUpdatedPerformancesToDB(performanceDetail[0]);
  }
};

// 테스트 실행 코드
Deno.test("Updating performance list", async () => {
  await updatePerformanceData();
});
