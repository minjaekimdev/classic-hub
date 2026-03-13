import { describe, it, expect, beforeEach } from "vitest";
import { syncPerformanceData } from "./syncPerformanceData";
import dayjs from "dayjs";
import RateLimiter from "shared/utils/rateLimiter";
import {
  clearStorage,
  getColumnData,
  getStorageFiles,
  resetData,
} from "../database";

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
  });

  it("DB와 스토리지에 데이터가 정상 업데이트 되어야 함", async () => {
    await syncPerformanceData(
      NOW,
      START_DATE,
      END_DATE,
      AFTER_DATE,
      UPDATE_END_DATE,
      kopisRateLimiter,
      0,
    );

    // DB와 스토리지에 데이터가 존재하면 성공
    const dbData = await getColumnData("performances", "performance_id");
    const storageData = await getStorageFiles("performances");
    expect(dbData.length).toBeGreaterThan(0);
    expect(storageData.length).toBeGreaterThan(0);
  }, 300000);
});
