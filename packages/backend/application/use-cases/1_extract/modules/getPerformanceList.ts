import logger from "@/shared/utils/logger";
import { failureCollector } from "../../shared/failureCollector";
import { kopisRateLimiter } from "../../lib/kopisRateLimiter";
import { getPerformanceWithBuffer } from "./getPerformanceWithBuffer";
import { InternalPerformance } from "../types";

export const getPerformanceList = async (ids: string[]) => {
  const result: InternalPerformance[] = [];
  for (const id of ids) {
    try {
      const performanceDetail = await kopisRateLimiter.execute(() =>
        getPerformanceWithBuffer(id),
      );
      result.push(performanceDetail);
    } catch (error: unknown) {
      logger.error("[FETCH_FAIL] Performance fetch failed");
      if (error instanceof Error) {
        failureCollector.add(id, "EXTRACT", error.message);
      } else {
        failureCollector.add(id, "EXTRACT", String(error));
      }
    }
  }

  return result;
};
