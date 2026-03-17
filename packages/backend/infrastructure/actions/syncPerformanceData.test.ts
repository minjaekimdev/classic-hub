import { describe, it, expect, beforeEach } from "vitest";
import { syncPerformanceData } from "./syncPerformanceData";
import dayjs from "dayjs";
import RateLimiter from "shared/utils/rateLimiter";
import {
  clearStorage,
  getColumnData,
  getRowsByEq,
  getStorageFiles,
  insertData,
  resetData,
} from "../database";

// 데이터 삭제를 위해 오래된 데이터 샘플 삽입
const sampleOldData = {
  performance_id: "PF214468",
  performance_name: "김호중 클래식 콘서트: TVAROTTI",
  period_from: "2023-03-15", // XML의 2023.03.15를 DB 규격에 맞춰 변환
  period_to: "2023-03-16",
  venue_id: "FC000020",
  venue_name: "세종문화회관 (세종대극장)",
  cast: "김호중",
  runtime: "2시간",
  age: "만 7세 이상",
  area: "서울특별시",
  state: "공연완료",
  time: "수요일 ~ 목요일(20:00)",
  poster:
    "http://www.kopis.or.kr/upload/pfmPoster/PF_PF214468_230306_160458.jpg",

  // 금액 파싱 결과 (문자열에서 숫자만 추출)
  min_price: 146000,
  max_price: 170000,

  // Json 타입 필드들
  price: [
    { grade: "VIP석", price: 170000 },
    { grade: "R석", price: 158000 },
    { grade: "S석", price: 146000 },
  ],
  booking_links: [
    {
      name: "멜론티켓",
      url: "https://ticket.melon.com/performance/index.htm?prodId=207897",
    },
    {
      name: "세종문화회관",
      url: "https://www.sejongpac.or.kr/portal/performance/performance/view.do?performIdx=33947&menuNo=200004",
    },
  ],
  detail_image: [
    "http://www.kopis.or.kr/upload/pfmIntroImage/PF_PF214468_230306_0404580.jpg",
  ],

  // 기타 필드
  program: null, // XML에 해당 정보 없음
  raw_data: {
    /* XML 전체 데이터를 JSON으로 변환한 객체 */
  },
  updated_at: "2023-03-06 17:00:55",
  created_at: new Date().toISOString(), // DB 삽입 시점
};

// 테스트를 위해 기간을 짧게 지정
const NOW = dayjs();
const START_DATE = NOW.format("YYYYMMDD");
const END_DATE = NOW.format("YYYYMMDD");
const AFTER_DATE = NOW.subtract(1, "day").format("YYYYMMDD");
const UPDATE_END_DATE = START_DATE;
const kopisRateLimiter = new RateLimiter(300);

describe("syncPerformanceData 테스트", () => {
  beforeEach(async () => {
    await resetData("performances", "performance_id");
    await clearStorage("performances");
    // 함수 실행 후 오래된 데이터가 남아있는지 확인을 위해 샘플 데이터 삽입
    await insertData("performances", sampleOldData, "performance_id");
  });

  it("DB와 스토리지에 데이터가 정상 업데이트 되어야 함", async () => {
    const beforeData = await getRowsByEq(
      "performances",
      "performance_id",
      "PF214468",
    );
    expect(beforeData.length).toBe(1);

    await syncPerformanceData(
      NOW,
      START_DATE,
      END_DATE,
      AFTER_DATE,
      UPDATE_END_DATE,
      kopisRateLimiter,
      "performances", // 테스트용 로컬 DB 테이블x
      0, // 재시도 횟수 0
    );

    // 데이터가 정상 삭제되었는지 확인
    const oldData = await getRowsByEq(
      "performances",
      "performance_id",
      "PF214468",
    );
    expect(oldData.length).toEqual(0);
    
    // DB와 스토리지에 데이터가 존재하면 성공
    const dbData = await getColumnData("performances", "performance_id");
    const storageData = await getStorageFiles("performances");

    expect(dbData.length).toBeGreaterThan(0);
    expect(storageData.length).toBeGreaterThan(0);
  }, 300000);
});
