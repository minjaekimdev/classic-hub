import logger from "@/shared/utils/logger";
import fs from "fs";
import path from "path";
import { Artifact, WorkflowError } from "shared/types/sync";

// 실패 데이터 artifact 파일명의 단일 진실 공급원.
// performance-update.yml 의 artifact path(packages/backend/failed_records.json)와 반드시 일치해야 한다.
// 파일명이 어긋나면 if-no-files-found: ignore 때문에 실패 데이터가 조용히 유실된다.
export const FAILED_RECORDS_FILENAME = "failed_records.json";

// 파일 저장 위치 (GitHub Actions 루트 기준)
const keyMapper: Record<WorkflowError, keyof Artifact> = {
  ProcessError: "processFailures",
  BatchInsertError: "batchInsertFailures",
  DetailFetchError: "detailFetchFailures",
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