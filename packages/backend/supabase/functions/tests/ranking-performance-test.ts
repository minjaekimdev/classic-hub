import { updateAllRankingData } from "../ranking-performance/index.js";

Deno.test("Updating ranking list", async () => {
  await updateAllRankingData();
});
