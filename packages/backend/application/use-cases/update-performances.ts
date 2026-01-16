import {
  API_URL,
  CLASSIC,
  SERVICE_KEY,
} from "@/infrastructure/external-api/kopis";
import { PerformanceDetail, PerformanceSummary } from "@/models/kopis";
import dayjs from "dayjs";
import { APIError, withErrorHandling } from "utils/error";
import convert, { ElementCompact } from "xml-js";
import { removeTextProperty } from "../services/preprocessing";
import { DBPerformance } from "@/models/supabase";
import {
  deleteData,
  getColumnData,
  insertData,
} from "@/infrastructure/database";
import RateLimiter from "utils/rateLimiter";
import logger from "utils/logger";

// "전석 40,000원" 형태인 경우 [ { seatType: '전석', price: 40000 } ]
// "전석무료" 인 경우 빈 배열 반환
const getParsedPrice = (originPrice: string) => {
  // "R석 12,345원" 형태의 그룹을 캡쳐하기 위한 정규표현식
  const regex = /([가-힣A-Z]+)\s+([\d,]+)원/g;

  const matches = originPrice.matchAll(regex);
  const parsedPrice = [];
  for (const match of matches) {
    const seatType = match[1];
    const price = Number(match[2].replace(/,/g, ""));
    parsedPrice.push({ seatType, price });
  }

  return parsedPrice;
};

const getMappedPerformanceDetail = (
  performanceDetail: PerformanceDetail
): DBPerformance => {
  const {
    mt20id,
    mt10id,
    prfnm,
    prfpdfrom,
    prfpdto,
    fcltynm,
    prfcast,
    prfruntime,
    prfage,
    pcseguidance,
    poster,
    prfstate,
    styurls,
    dtguidance,
    ...rest
  } = performanceDetail;

  return {
    performance_id: mt20id,
    venue_id: mt10id,
    performance_name: prfnm,
    period_from: prfpdfrom,
    period_to: prfpdto,
    venue_name: fcltynm,
    cast: prfcast,
    runtime: prfruntime,
    age: prfage,
    price: getParsedPrice(pcseguidance), // 필요시 여기서 파싱 로직 추가
    poster: poster,
    state: prfstate,
    detail_image: Array.isArray(styurls.styurl)
      ? styurls.styurl
      : [styurls.styurl], // 배열로 통일
    time: dtguidance,
    raw_data: rest, // 나머지 15개 내외의 데이터가 JSON 형태로 들어감
  };
};

const getPerformanceIdsInPage = async (api: string) => {
  return withErrorHandling(
    async () => {
      const response = await fetch(api);

      // HTTP 에러일 경우 (503 등)
      if (!response.ok) {
        throw new APIError(
          "KOPIS performance page API request failed!",
          response.status
        );
      }

      const xmlText = await response.text();
      const parsedData: ElementCompact = convert.xml2js(xmlText, {
        compact: true,
      });

      // API 요청에는 성공했으나 더이상 데이터가 없는 경우
      if (!parsedData.dbs.db) {
        return null;
      }

      // _text 프로퍼티를 제거하여 순수 공연 id만으로 이루어진 배열 반환
      const processedResult = removeTextProperty(parsedData.dbs.db);
      const performanceSummaryArray = (Array.isArray(processedResult)
        ? processedResult
        : [processedResult]) as unknown as PerformanceSummary[];

      return performanceSummaryArray.map(
        (item: PerformanceSummary) => item.mt20id
      );
    },
    [],
    "kopis"
  );
};

const getUpdatedPerformaces = async (
  afterDate: string,
  startDate: string,
  endDate: string
) => {
  const result = [];

  let page = 1;
  while (true) {
    const api = `${API_URL}/pblprfr?service=${SERVICE_KEY}&stdate=${startDate}&eddate=${endDate}&cpage=${page++}&rows=${100}&shcate=${CLASSIC}&afterdate=${afterDate}`;
    const performanceIdArray = await kopisRateLimiter.execute(async () => {
      return getPerformanceIdsInPage(api);
    });

    // 더 이상 데이터가 없는 경우 반복문 빠져나오기
    if (!performanceIdArray) {
      break;
    }

    // 어제 이후로 업데이트된 페이지당 공연 id를 가져올 때 에러가 발생한 경우
    if (performanceIdArray.length === 0) {
      throw new Error(`KOPIS API updated performance get call failed`);
    }
    result.push(...performanceIdArray);
  }
  return result;
};

// 오늘 ~ 대상 기간동안의 새 공연 데이터 id 배열 리턴하기
const getPerformances = async (startDate: string, endDate: string) => {
  const result = [];

  let page = 1;
  while (true) {
    const api = `${API_URL}/pblprfr?service=${SERVICE_KEY}&stdate=${startDate}&eddate=${endDate}&cpage=${page++}&rows=${100}&shcate=${CLASSIC}`;
    const performanceIdArray = await kopisRateLimiter.execute(async () => {
      return await getPerformanceIdsInPage(api);
    });

    // 더 이상 데이터가 없는 경우 반복문 빠져나오기
    if (!performanceIdArray) {
      break;
    }

    // 페이지별 새 공연 id 배열을 받아올 때 에러가 발생한 경우,
    // 추후 업데이트에도 영향을 미치므로 에러를 throw하여 프로그램 실행 종료시키기(예외처리 X)
    if (performanceIdArray.length === 0) {
      throw new Error(`KOPIS API new performance get call failed`);
    }
    result.push(...performanceIdArray);
  }

  return result;
};

const getPerformanceDetail = async (
  performanceId: string
): Promise<PerformanceDetail | null> => {
  return withErrorHandling(
    async () => {
      const response: ElementCompact = await fetch(
        `${API_URL}/pblprfr/${performanceId}?service=${SERVICE_KEY}`
      );

      if (!response.ok) {
        throw new APIError(
          `KOPIS performance detail API request failed at id ${performanceId}`,
          response.status
        );
      }

      const xmlText = await response.text();
      const parsedData: ElementCompact = convert.xml2js(xmlText, {
        compact: true,
      });

      const result = removeTextProperty(
        parsedData.dbs.db
      ) as unknown as PerformanceDetail;

      return result;
    },
    null,
    "kopis"
  );
};

const getPerformaceDetailArray = async (idsToInsert: string[]) => {
  const successes: DBPerformance[] = [];
  const failures: { id: string; error: any }[] = [];

  for (const id of idsToInsert) {
    const performanceDetail = await kopisRateLimiter.execute(async () => {
      return await getPerformanceDetail(id);
    });

    if (!performanceDetail) {
      failures.push({ id, error: "APIError" });
      continue;
    }
    successes.push(getMappedPerformanceDetail(performanceDetail));
  }

  return { successes, failures };
};

const updatePerformancesInDB = async () => {
  const now = dayjs();
  const startDate = now.format("YYYYMMDD");
  const endDate = now.add(365, "days").format("YYYYMMDD");
  const afterDate = now.subtract(1, "days").format("YYYYMMDD");
  const updateEndDate = now.add(364, "days").format("YYYYMMDD");

  const newPerformances = new Set(await getPerformances(startDate, endDate));
  const dbPerformances = new Set(
    await getColumnData("performances", "performance_id")
  );

  // DB에는 있지만 새 공연 데이터에는 없는 id -> 삭제 대상
  const idsToDelete = [...dbPerformances].filter(
    (id) => !newPerformances.has(id)
  );
  // 새 공연 데이터에는 있지만 DB에는 없는 id -> 삽입 대상
  const idsToInsert = [...newPerformances].filter(
    (id) => !dbPerformances.has(id)
  );

  // 데이터 삭제
  await deleteData("performances", "performance_id", idsToDelete);
  // 데이터 삽입
  const { successes: insertDataList, failures: insertFailures } =
    await getPerformaceDetailArray(idsToInsert);
  if (insertDataList.length > 0) {
    await insertData("performances", insertDataList, "performance_id");
  }
  if (insertFailures.length > 0) {
    logger.warn(
      `[INSERT_FAIL] ${
        insertFailures.length
      } items failed. IDs: ${insertFailures.map((f) => f.id).join(", ")}`
    );
  }

  // update 관련 로직은 상대적으로 중요도가 낮으므로 새 공연 데이터 삽입이 완료된 이후에 실행
  const idsToUpdate = await getUpdatedPerformaces(
    afterDate,
    startDate,
    updateEndDate
  );
  const { successes: updateDataList, failures: updateFailures } =
    await getPerformaceDetailArray(idsToUpdate);
  if (updateDataList.length > 0) {
    await insertData("performances", updateDataList, "performance_id");
  }
  if (updateFailures.length > 0) {
    logger.warn(
      `[UPDATE_FAIL] ${
        updateFailures.length
      } items failed. IDs: ${updateFailures.map((f) => f.id).join(", ")}`
    );
  }
};

// 초당 10회 호출 제한이지만, 넉넉하게 초당 5회 호출
const kopisRateLimiter = new RateLimiter(300);
(async () => {
  await updatePerformancesInDB();
})();
