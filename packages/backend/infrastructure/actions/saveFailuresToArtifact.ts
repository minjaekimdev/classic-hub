import logger from "@/shared/utils/logger";
import fs from "fs";
import path from "path";
import { Artifact, WorkflowError } from "shared/types/sync";

// 파일 저장 위치 (GitHub Actions 루트 기준)
const keyMapper: Record<WorkflowError, keyof Artifact> = {
  ProcessError: "processFailures",
  BatchInsertError: "batchInsertFailures",
};

export const saveFailuresToArtifact = (
  failFilePath: string,
  data: any[],
  errorType: WorkflowError,
) => {
  let existing: any = {};
  
  if (fs.existsSync(failFilePath)) {
    try {
      const fileContent = fs.readFileSync(failFilePath, "utf-8").trim();
      // 파일 내용이 있을 때만 파싱, 없으면 빈 객체 유지
      existing = fileContent ? JSON.parse(fileContent) : {};
    } catch (error) {
      logger.error(`[JSON_PARSE_ERROR] ${failFilePath} 파싱 실패, 초기화합니다.`, error);
      existing = {}; // 파싱 실패 시 초기화해서 덮어쓰기 준비
    }
  }

  const key = keyMapper[errorType];
  if (!existing[key]) {
    existing[key] = data;
  } else {
    existing[key].push(...data);
  }

  fs.writeFileSync(failFilePath, JSON.stringify(existing, null, 2));
};