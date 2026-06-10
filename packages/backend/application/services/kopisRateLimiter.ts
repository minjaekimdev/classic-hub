import { RATE_LIMIT } from "@/application/constants/limits";
import RateLimiter from "@/shared/utils/rateLimiter";

export const kopisRateLimiter = new RateLimiter(RATE_LIMIT.KOPIS);
