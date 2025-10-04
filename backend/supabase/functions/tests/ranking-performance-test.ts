import { updateAllRankingData } from "../ranking-performance/index.ts";

Deno.test("Updating ranking list", async () => {
  await updateAllRankingData();
});
