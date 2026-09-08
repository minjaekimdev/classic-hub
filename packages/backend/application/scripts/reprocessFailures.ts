import fs from "fs";
import os from "os";
import path from "path";
import { execFileSync } from "child_process";
import logger from "@/shared/utils/logger";
import { sendSlackNotification } from "@/shared/utils/monitor";
import { kopisService } from "@/infrastructure/kopis/service";
import { callDatabaseFunction } from "@/infrastructure/supabase/database";
import { transformPerformances } from "../use-cases/2_transform";
import { createReprocessFailures } from "../services/reprocessFailures";
import { Artifact } from "shared/types/sync";

// GitHub Actions artifact명: failed-performances-<run_id> (performance-update.yml 참고)
const ARTIFACT_NAME_PREFIX = "failed-performances-";
const ARTIFACT_FILENAME = "failed_records.json";

const usage = () =>
  "사용법: npm run reprocess-failures -- --run <runId> | --file <failed_records.json 경로>";

const parseArgs = (argv: string[]) => {
  const args: { runId?: string; file?: string } = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--run") args.runId = argv[i + 1];
    if (argv[i] === "--file") args.file = argv[i + 1];
  }
  return args;
};

const downloadArtifact = (runId: string): string => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "failed-records-"));
  execFileSync(
    "gh",
    ["run", "download", runId, "-n", `${ARTIFACT_NAME_PREFIX}${runId}`, "-D", dir],
    { stdio: "inherit" },
  );
  return path.join(dir, ARTIFACT_FILENAME);
};

(async () => {
  const args = parseArgs(process.argv.slice(2));

  const filePath = args.file ?? (args.runId ? downloadArtifact(args.runId) : null);
  if (!filePath || !fs.existsSync(filePath)) {
    logger.error(`failed_records.json을 찾을 수 없습니다.\n${usage()}`);
    process.exitCode = 1;
    return;
  }

  const artifact = JSON.parse(
    fs.readFileSync(filePath, "utf-8"),
  ) as Artifact;

  const reprocess = createReprocessFailures({
    fetchPerformanceDetail: (id) => kopisService.getPerformanceDetail(id),
    processor: transformPerformances,
    insertBulk: (payload) =>
      callDatabaseFunction("upsert_performances_bulk", { payload }),
    log: logger,
  });

  const outcome = await reprocess(artifact);

  logger.info(
    `[REPROCESS] 완료 — 재적재 ${outcome.insertRecovered}건 / 재적재 실패 ${outcome.insertFailed}건 / 여전히 실패 ${outcome.stillFailed.length}건`,
  );

  if (outcome.stillFailed.length > 0) {
    await sendSlackNotification(
      `⚠️ [REPROCESS] ${outcome.stillFailed.length}건은 재처리 후에도 실패했습니다.`,
    );
    process.exitCode = 1;
  }
})().catch((error) => {
  logger.error("[REPROCESS_CRASH] 재처리 실행이 비정상 종료됐습니다.", error);
  process.exitCode = 1;
});
