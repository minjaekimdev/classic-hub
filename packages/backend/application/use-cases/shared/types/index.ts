import { DetailPerformance } from "@classic-hub/shared/types/client";

export type Step = "EXTRACT" | "TRANSFORM" | "LOAD";

// TODO: data를 옵셔널 타입으로 선언해도 무방할까?
export type FailedRecord = {
  id: string;
  step: Step;
  error: string;
  timestamp: string;
  data?: DetailPerformance;
};
