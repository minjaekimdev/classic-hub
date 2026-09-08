import { RATE_LIMIT } from "@/application/constants/limits";
import RateLimiter from "@/shared/utils/rateLimiter";

// KOPIS API(메타데이터)와 정적 이미지(poster/styurls)가 공유하는 단일 limiter.
// 문의 결과 둘 다 초당 10회 제한이며, extract→transform이 직렬 실행이라 큐가 겹치지 않아
// 하나로 통합해도 총 호출 속도는 5회/초 이하로 유지된다.
export const kopisRateLimiter = new RateLimiter(RATE_LIMIT.KOPIS);
