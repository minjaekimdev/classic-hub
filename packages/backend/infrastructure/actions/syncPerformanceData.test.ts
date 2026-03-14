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
  performance_id: "PF279748",
  performance_name: "영유아 클래식 콘서트: 김현아 X 오감클래식",
  period_from: "2025-05-24",
  period_to: "2025-08-27",
  venue_id: "FC004377",
  venue_name: "현대프리미엄아울렛 [김포] (WEST존 고객랑운지 (2층) )",
  area: "경기도",
  age: "전체 관람가",
  state: "공연완료",
  poster:
    "http://www.kopis.or.kr/upload/pfmPoster/PF_PF279748_251120_165117.jpg",
  runtime: null,
  cast: null,
  time: "토요일(11:00,12:30,14:00)",
  min_price: null,
  max_price: null,
  price: null,
  booking_links: [
    {
      name: "네이버N예약",
      url: "https://booking.naver.com/booking/12/bizes/1124515",
    },
  ],
  detail_image: [
    "http://www.kopis.or.kr/upload/pfmIntroImage/PF_PF279748_202511200451179940.jpg",
  ],
  program: null,
  raw_data: {
    sty: "[공연소개] 바이올린 · 비올라 · 첼로 · 플룻 · 피아노 · 성악",
    entrpsnmH: "오감클래식",
    child: "Y",
  },
  updated_at: "2026-02-27T14:14:38Z",
  created_at: "2026-03-13T20:59:08Z",
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
      "PF279748",
    );
    expect(beforeData.length).toBe(1);

    await syncPerformanceData(
      NOW,
      START_DATE,
      END_DATE,
      AFTER_DATE,
      UPDATE_END_DATE,
      kopisRateLimiter,
      "performances", // 테스트용 로컬 DB 테이블
      0,
    );

    // 에러가 발생하면 데이터가 정상 삭제된 것(데이터가 없으므로)
    const oldData = await getRowsByEq("performances", "performance_id", "PF279748");
    expect(oldData.length).toEqual(0);

    // DB와 스토리지에 데이터가 존재하면 성공
    const dbData = await getColumnData("performances", "performance_id");
    const storageData = await getStorageFiles("performances");

    expect(dbData.length).toBeGreaterThan(0);
    expect(storageData.length).toBeGreaterThan(0);
  }, 300000);
});
