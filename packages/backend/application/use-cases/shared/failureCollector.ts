import { FailedRecord, Step } from "./types";
import { DetailPerformance } from "@classic-hub/shared/types/client";

class FailureCollector {
  private failures: FailedRecord[] = [];
  add(id: string, step: Step, error: any, data?: DetailPerformance) {
    const record = {
      id,
      step,
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
      data,
    };

    this.failures.push(record);
  }

  getFailures() {
    return this.failures;
  }

  clear() {
    this.failures = [];
  }
}

// 싱글톤 활용
export const failureCollector = new FailureCollector();
