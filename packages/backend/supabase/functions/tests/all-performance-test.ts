import { updatePerformanceData } from "../all-performance/index.js";

Deno.test("Updating performance list", async () => {
  await updatePerformanceData();
});
