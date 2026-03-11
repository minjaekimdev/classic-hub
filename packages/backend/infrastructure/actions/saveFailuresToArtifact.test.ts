import { describe, it, expect, beforeEach } from "vitest";
import fs from "fs";
import { saveFailuresToArtifact } from "./saveFailuresToArtifact";

describe("saveFailuresToArtifact 테스트", () => {
  beforeEach(() => {
    // 테스트마다 파일을 지워서 독립적인 환경 생성
    if (fs.existsSync("failed_records.json"))
      fs.unlinkSync("failed_records.json");
  });

  it("데이터가 없을 때 새로운 키를 생성하고 데이터를 넣어야 한다", () => {
    const mockData = [{ id: 1 }];
    saveFailuresToArtifact(mockData, "BatchInsertError");

    const result = JSON.parse(fs.readFileSync("failed_records.json", "utf-8"));
    expect(result.batchInsertFailures).toHaveLength(1);
    expect(result.batchInsertFailures[0].id).toBe(1);
  });

  it("기존에 데이터가 있으면 배열에 추가(push)해야 한다", () => {
    saveFailuresToArtifact([{ id: 1 }], "BatchInsertError");
    saveFailuresToArtifact([{ id: 2 }], "BatchInsertError");

    const result = JSON.parse(fs.readFileSync("failed_records.json", "utf-8"));
    expect(result.batchInsertFailures).toHaveLength(2);
  });

  it("ProcessError가 발생했을 때 processFailures 키에 데이터를 넣어야 한다", () => {
    const processData = [{ reason: "API Timeout", at: "2024-03-21" }];
    saveFailuresToArtifact(processData, "ProcessError");

    const result = JSON.parse(fs.readFileSync("failed_records.json", "utf-8"));

    // processFailures가 존재하는지, 데이터가 맞는지 검증
    expect(result.processFailures).toBeDefined();
    expect(result.processFailures).toHaveLength(1);
    expect(result.processFailures[0].reason).toBe("API Timeout");
  });

  it("여러 종류의 에러(DBError, ProcessError)가 발생해도 각각의 키에 데이터가 유지되어야 한다", () => {
    // 1. DB 에러 먼저 저장
    saveFailuresToArtifact([{ id: 101 }], "BatchInsertError");

    // 2. 프로세스 에러 이어서 저장
    saveFailuresToArtifact([{ msg: "Parsing Error" }], "ProcessError");

    const result = JSON.parse(fs.readFileSync("failed_records.json", "utf-8"));

    // 두 바구니 모두 데이터가 잘 들어있는지 확인
    expect(result.batchInsertFailures).toHaveLength(1);
    expect(result.processFailures).toHaveLength(1);
    expect(result.batchInsertFailures[0].id).toBe(101);
    expect(result.processFailures[0].msg).toBe("Parsing Error");
  });
});
