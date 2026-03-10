import fetchAndInsertPerformances from "@/application/use-cases/database/fetchAndInsertPerformances";
import RateLimiter from "shared/utils/rateLimiter";

const kopisRateLimiter = new RateLimiter(300);

const performanceIds = [
  "PF283890",
  "PF283881",
  "PF283880",
  "PF283879",
  "PF283875",
  "PF283868",
  "PF283867",
  "PF283864",
  "PF283566",
  "PF283563",
  "PF281024",
  "PF280965",
  "PF280928",
  "PF280846",
  "PF280845",
  "PF280843",
];

(async () => {
  await fetchAndInsertPerformances(performanceIds, kopisRateLimiter);
})();
