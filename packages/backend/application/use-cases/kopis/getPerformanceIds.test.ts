import RateLimiter from "@/shared/utils/rateLimiter";
import { describe, it } from "vitest";
import { getPerformanceIds } from "./getPerformanceIds";
import { KOPIS_RATE_LIMIT } from "@/application/constants";

describe("getPerformanceIds 테스트", () => {
  it("여러 페이지의 공연 데이터를 정상적으로 가져와야 한다", async () => {
    const startDate = "20260316";
    const endDate = "20260323";
    const kopisRateLimiter = new RateLimiter(KOPIS_RATE_LIMIT);

    const performanceIds = await getPerformanceIds(startDate, endDate, kopisRateLimiter)
    
    console.log("performanceIds: ", performanceIds);
  })
})