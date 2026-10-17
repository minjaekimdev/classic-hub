import { useMutation } from "@tanstack/react-query";
import {
  submitProgramReport,
  submitServiceFeedback,
  type ProgramReportInput,
  type ServiceFeedbackInput,
} from "@/api/feedbacks";

/**
 * 제보/피드백 INSERT는 재시도 시 중복 접수의 위험이 있으므로 retry 하지 않는다.
 * 공연 데이터를 변경하지 않으므로 invalidate할 캐시도 없다 (design-decisions §5).
 */
export default function useSubmitServiceFeedback() {
  return useMutation({ mutationFn: (input: ServiceFeedbackInput) => submitServiceFeedback(input), retry: false });
}

export function useSubmitProgramReport() {
  return useMutation({ mutationFn: (input: ProgramReportInput) => submitProgramReport(input), retry: false });
}
