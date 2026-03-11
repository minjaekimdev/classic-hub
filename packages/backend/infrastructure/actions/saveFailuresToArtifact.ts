import fs from "fs";
import path from "path";
import { Artifact, WorkflowError } from "shared/types/sync";

// 파일 저장 위치 (GitHub Actions 루트 기준)
const FAIL_FILE = path.join(process.cwd(), "failed_records.json");

const keyMapper: Record<WorkflowError, keyof Artifact> = {
  ProcessError: "processFailures",
  BatchInsertError: "batchInsertFailures",
};

export const saveFailuresToArtifact = (data: any[], errorType: WorkflowError) => {
  let existing: any = {};
  if (fs.existsSync(FAIL_FILE)) {
    existing = JSON.parse(fs.readFileSync(FAIL_FILE, "utf-8"));
  }

  // existing 객체에 키가 해당 키가 없다면
  const key = keyMapper[errorType];
  if (!existing[key]) {
    existing[key] = data
  } else {
    existing[key].push(...data);
  }

  // 기존 실패 데이터 + 이번에 실패한 뭉텅이 합치기
  // 한 번 워크플로우(job)에서 기존에 실패한 데이터와 현재 데이터를 합친다.(서버가 종료될 경우 파일은 사라진다)
  fs.writeFileSync(FAIL_FILE, JSON.stringify(existing, null, 2));
};
