import { describe, it, expect, beforeEach } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";
import {
  saveFailuresToArtifact,
  FAILED_RECORDS_FILENAME,
} from "./saveFailuresToArtifact";

const testFilePath = path.join(os.tmpdir(), "failed_records.test.json");

describe("saveFailuresToArtifact 테스트", () => {
  beforeEach(() => {
    if (fs.existsSync(testFilePath)) fs.unlinkSync(testFilePath);
  });

  it("데이터가 없을 때 새로운 키를 생성하고 데이터를 넣어야 한다", () => {
    const mockData = [{ id: 1 }];
    saveFailuresToArtifact(testFilePath, mockData, "BatchInsertError");

    const result = JSON.parse(fs.readFileSync(testFilePath, "utf-8"));
    expect(result.batchInsertFailures).toHaveLength(1);
    expect(result.batchInsertFailures[0].id).toBe(1);
  });

  it("기존에 데이터가 있으면 배열에 추가(push)해야 한다", () => {
    saveFailuresToArtifact(testFilePath, [{ id: 1 }], "BatchInsertError");
    saveFailuresToArtifact(testFilePath, [{ id: 2 }], "BatchInsertError");

    const result = JSON.parse(fs.readFileSync(testFilePath, "utf-8"));
    expect(result.batchInsertFailures).toHaveLength(2);
  });

  it("ProcessError가 발생했을 때 processFailures 키에 데이터를 넣어야 한다", () => {
    const processData = [{ reason: "API Timeout", at: "2024-03-21" }];
    saveFailuresToArtifact(testFilePath, processData, "ProcessError");

    const result = JSON.parse(fs.readFileSync(testFilePath, "utf-8"));

    expect(result.processFailures).toBeDefined();
    expect(result.processFailures).toHaveLength(1);
    expect(result.processFailures[0].reason).toBe("API Timeout");
  });

  it("여러 종류의 에러(BatchInsertError, ProcessError)가 발생해도 각각의 키에 데이터가 유지되어야 한다", () => {
    saveFailuresToArtifact(testFilePath, [{ id: 101 }], "BatchInsertError");
    saveFailuresToArtifact(testFilePath, [{ msg: "Parsing Error" }], "ProcessError");

    const result = JSON.parse(fs.readFileSync(testFilePath, "utf-8"));

    expect(result.batchInsertFailures).toHaveLength(1);
    expect(result.processFailures).toHaveLength(1);
    expect(result.batchInsertFailures[0].id).toBe(101);
    expect(result.processFailures[0].msg).toBe("Parsing Error");
  });

  it("FAILED_RECORDS_FILENAME은 performance-update.yml의 artifact path와 일치해야 한다", () => {
    // 이 계약이 어긋나면 if-no-files-found: ignore 때문에 실패 데이터가 조용히 유실된다.
    // (과거 failed_actions.json vs failed_records.json 불일치로 실제 유실이 발생한 적이 있다)
    const workflowPath = path.join(
      __dirname,
      "../../../../.github/workflows/performance-update.yml",
    );
    const workflow = fs.readFileSync(workflowPath, "utf-8");

    expect(workflow).toContain(`packages/backend/${FAILED_RECORDS_FILENAME}`);
  });
});
