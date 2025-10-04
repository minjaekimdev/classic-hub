import { updatePerformanceData } from "../all-performance/index.ts";

Deno.test("Updating performance list", async () => {
  await updatePerformanceData();
});
