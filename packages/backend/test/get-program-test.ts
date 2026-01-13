import getProgramJSON from "@/application/use-cases/get-program";
import {
  programImage1,
  programImage2,
  programImage3,
} from "./datasets/image-program";
import { programText1 } from "./datasets/text-program";
import RateLimiter from "utils/rateLimiter";

(async () => {
  const geminiRateLimiter = new RateLimiter(15);
  // geminiRateLimiter.execute(() => getProgramJSON("pf001", programText1));
  // geminiRateLimiter.execute(() =>
  //   getProgramJSON("pf002", { styurl: programImage1 })
  // );
  // geminiRateLimiter.execute(() =>
  //   getProgramJSON("pf003", { styurl: programImage2 })
  // );
  geminiRateLimiter.execute(() =>
    getProgramJSON("pf003", { styurl: programImage3 })
  );
})();
