import {
  API_URL,
  CLASSIC,
  SERVICE_KEY,
} from "@/infrastructure/external-api/kopis";
import {
  BookingLink as KopisBookingLink,
  PerformanceDetail,
  PerformanceSummary,
} from "@/models/kopis";
import dayjs from "dayjs";
import { APIError, withErrorHandling } from "utils/error";
import { removeTextProperty } from "../services/preprocessor";
import { DBPerformance } from "@classic-hub/shared/types/database";
import { BookingLink } from "@classic-hub/shared/types/common";
import {
  deleteData,
  getColumnData,
  insertData,
} from "@/infrastructure/database";
import RateLimiter from "utils/rateLimiter";
import logger from "utils/logger";
import { kopisFetcher } from "../services/kopis-fetcher";
import { sendSlackNotification } from "utils/monitor";

// "전석 40,000원" 형태인 경우 [ { seatType: '전석', price: 40000 } ]
// "전석무료" 인 경우 빈 배열 반환
const getParsedPrice = (raw: string) => {
  // "R석 12,345원" 형태의 그룹을 캡쳐하기 위한 정규표현식
  const regex = /([가-힣A-Z]+)\s+([\d,]+)원/g;

  const matches = raw.matchAll(regex);
  const parsedPrice = [];
  for (const match of matches) {
    const seatType = match[1];
    const price = Number(match[2].replace(/,/g, ""));
    parsedPrice.push({ seatType, price });
  }

  return parsedPrice;
};

const getParsedBookingLinks = (
  raw: KopisBookingLink | KopisBookingLink[],
): BookingLink[] => {
  const bookingLinks = Array.isArray(raw) ? raw : [raw];
  return bookingLinks.map((item) => ({
    name: item.relatenm,
    url: item.relateurl,
  }));
};

const getMappedPerformanceDetail = (
  performanceDetail: PerformanceDetail,
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
    relates,
    styurls,
    dtguidance,
    area,
    ...rest
  } = performanceDetail;

  return {
    performance_id: mt20id,
    venue_id: mt10id,
    performance_name: prfnm,
    area,
    period_from: prfpdfrom,
    period_to: prfpdto,
    venue_name: fcltynm,
    cast: prfcast,
    runtime: prfruntime,
    age: prfage,
    price: getParsedPrice(pcseguidance), // 필요시 여기서 파싱 로직 추가
    poster: poster,
    state: prfstate,
    booking_links: getParsedBookingLinks(relates.relate),
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
      const parsedData = await kopisFetcher(api);

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
        (item: PerformanceSummary) => item.mt20id,
      );
    },
    [],
    "kopis",
  );
};

const getUpdatedPerformaces = async (
  afterDate: string,
  startDate: string,
  endDate: string,
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
const getPerformanceIds = async (startDate: string, endDate: string) => {
  const result = [];

  let page = 1;
  while (true) {
    const api = `${API_URL}/pblprfr?service=${SERVICE_KEY}&stdate=${startDate}&eddate=${endDate}&cpage=${page}&rows=${100}&shcate=${CLASSIC}`;
    const performanceIdArray = await kopisRateLimiter.execute(async () => {
      return await getPerformanceIdsInPage(api);
    });

    let currentPage = page++;

    // 더 이상 데이터가 없는 경우 반복문 빠져나오기
    if (!performanceIdArray) {
      break;
    }

    // 무한루프 도는지 파악을 위한 로깅
    logger.debug(
      `[FETCH_PAGE] Page ${currentPage}: Found ${performanceIdArray.length} items`,
    );

    // 페이지별 새 공연 id 배열을 받아올 때 에러가 발생한 경우 빈 배열 리턴
    if (performanceIdArray.length === 0) {
      return [];
    }
    result.push(...performanceIdArray);
  }

  return result;
};

const getPerformanceDetail = async (
  performanceId: string,
): Promise<PerformanceDetail | null> => {
  return withErrorHandling(
    async () => {
      const parsedData = await kopisFetcher(
        `${API_URL}/pblprfr/${performanceId}?service=${SERVICE_KEY}`,
      );

      const result = removeTextProperty(
        parsedData.dbs.db,
      ) as unknown as PerformanceDetail;

      return result;
    },
    null,
    "kopis",
  );
};

// KOPIS에 idsToInsert에 있는 공연들에 대한 상세 데이터를 받아온 뒤 DB 엔티티에 맞게 매핑하여 반환하는 함수
const getPerformaceDetailArray = async (idsToInsert: string[]) => {
  // 상세 데이터를 가져오는 데 성공한 공연, 실패한 공연 id를 따로 저장
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

const fetchAndInsertPerformances = async (ids: string[], log?: string) => {
  // 데이터 삽입
  const { successes, failures } = await getPerformaceDetailArray(ids);
  if (successes.length > 0) {
    await withErrorHandling(
      async () => {
        await insertData("performances", successes, "performance_id");
        logger.info(
          `[INSERT_SUCCESS] ${successes.length} items succeeded(${log})`,
          { service: "supabase" },
        );
        await sendSlackNotification(
          `✅ [INSERT_SUCCESS] ${successes.length} items succeeded(${log})`,
        );
      },
      async () => {
        logger.error(`[INSERT_FAIL] ${successes.length} items failed(${log})`, {
          service: "supabase",
        });
        await sendSlackNotification(
          `[INSERT_FAIL] ${successes.length} items failed(${log})`,
        );
      },
    );
  }
  if (failures.length > 0) {
    logger.error(
      `[FETCH_FAIL] ${
        failures.length
      } performance detail fetch failed.(${log}) IDs: ${failures.map((f) => f.id).join(", ")}`,
      { service: "kopis" },
    );
    await sendSlackNotification(
      `❌ [FETCH_FAIL] ${failures.length} performance detail fetch failed.(${log})`,
    );
  }
};

const deletePerformances = async (ids: string[]) => {
  await withErrorHandling(
    async () => {
      await deleteData("performances", "performance_id", ids);
      logger.info(`[DELETE_SUCCESS] data delete succeeded`, {
        service: "supabase",
      });
      await sendSlackNotification("✅ [DELETE_SUCCESS] data delete succeeded");
    },
    async () => {
      logger.error("[DELETE_FAIL] data delete Failed", {
        service: "supabase",
      });
      await sendSlackNotification("❌ [DELETE_FAIL] data delete Failed");
    },
  );
};

const updatePerformancesInDB = async () => {
  const now = dayjs();
  const startDate = now.format("YYYYMMDD");
  const endDate = now.add(365, "days").format("YYYYMMDD");
  const afterDate = now.subtract(1, "days").format("YYYYMMDD");
  const updateEndDate = now.add(364, "days").format("YYYYMMDD");

  const newPerformances = await withErrorHandling(async () => {
    const result = await getPerformanceIds(startDate, endDate);

    if (result.length === 0) {
      logger.error("[FETCH_FAIL] new data fetch failed", {
        service: "kopis",
      });
      await sendSlackNotification("❌ [FETCH_FAIL] new data fetch failed");
      throw new APIError("[FETCH_FAIL] new data fetch failed");
    }

    return result;
  }); // 추후 업데이트에도 영향을 미치므로 fallback을 지정하지 않음

  const dbPerformances = await withErrorHandling(
    async () => {
      return await getColumnData("performances", "performance_id");
    },
    async () => {
      logger.error("[FETCH_FAIL] old DB data fetch failed", {
        service: "supabase",
      });
      await sendSlackNotification("❌ [FETCH_FAIL] old DB data fetch failed");
      throw new Error("[FETCH_FAIL] old DB data fetch failed");
    },
  );

  const newPerformancesSet = new Set(newPerformances);
  const dbPerformancesSet = new Set(dbPerformances);

  // DB에는 있지만 새 공연 데이터에는 없는 id -> 삭제 대상
  const idsToDelete = [...dbPerformances].filter(
    (id) => !newPerformancesSet.has(id),
  );
  // 새 공연 데이터에는 있지만 DB에는 없는 id -> 삽입 대상
  const idsToInsert = [...newPerformances].filter(
    (id) => !dbPerformancesSet.has(id),
  );

  await deletePerformances(idsToDelete);
  await fetchAndInsertPerformances(idsToInsert, "new datas");

  // update 관련 로직은 상대적으로 중요도가 낮으므로 새 공연 데이터 삽입이 완료된 이후에 실행
  const idsToUpdate = await getUpdatedPerformaces(
    afterDate,
    startDate,
    updateEndDate,
  );

  await fetchAndInsertPerformances(idsToUpdate, "updated datas");
};

// 초당 10회 호출 제한이지만, 넉넉하게 초당 5회 호출
const kopisRateLimiter = new RateLimiter(300);
(async () => {
  await updatePerformancesInDB();
})();
