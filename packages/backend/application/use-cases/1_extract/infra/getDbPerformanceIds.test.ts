import { describe, it, expect, vi } from "vitest";
import {
  createGetDbPerformanceIds,
  GetDbPerformanceIdsDeps,
} from "./getDbPerformanceIds";

// 헬퍼: 테스트에서의 deps 스텁을 쉽게 만든다. 필요한 부분만 overrides로 교체.
const makeDeps = (
  overrides: Partial<GetDbPerformanceIdsDeps> = {},
): GetDbPerformanceIdsDeps => ({
  getColumnData: vi.fn(),
  ...overrides,
});

describe("getDbPerformanceIds 비즈니스 로직 테스트", () => {
  // 시나리오 1: 정상 흐름
  it("전달받은 table/column을 그대로 getColumnData에 넘기며 결과 배열을 반환해야 한다", async () => {
    const getColumnData = vi.fn().mockResolvedValue(["ID_1", "ID_2", "ID_3"]);

    const getDbPerformanceIds = createGetDbPerformanceIds(makeDeps({ getColumnData }));
    const result = await getDbPerformanceIds("performances", "performance_id");

    expect(result).toEqual(["ID_1", "ID_2", "ID_3"]);
    expect(getColumnData).toHaveBeenCalledWith("performances", "performance_id");
    expect(getColumnData).toHaveBeenCalledTimes(1);
  });

  // 시나리오 2: 빈 결과
  it("DB에 데이터가 없으면 빈 배열을 그대로 반환해야 한다", async () => {
    const getColumnData = vi.fn().mockResolvedValue([]);

    const getDbPerformanceIds = createGetDbPerformanceIds(makeDeps({ getColumnData }));
    const result = await getDbPerformanceIds("performances", "performance_id");

    expect(result).toEqual([]);
  });

  // 시나리오 3: getColumnData 에러 전파
  it("getColumnData가 에러를 던지면 상위로 그대로 전파해야 한다", async () => {
    const error = new Error("DB Fetch Failed");
    const getColumnData = vi.fn().mockRejectedValue(error);

    const getDbPerformanceIds = createGetDbPerformanceIds(makeDeps({ getColumnData }));

    await expect(
      getDbPerformanceIds("performances", "performance_id"),
    ).rejects.toThrow(error);
  });

  // 시나리오 4: 다른 table/column 조합 전달
  it("다른 table/column 조합을 전달해도 동일하게 넘겨야 한다", async () => {
    const getColumnData = vi.fn().mockResolvedValue(["A", "B"]);

    const getDbPerformanceIds = createGetDbPerformanceIds(makeDeps({ getColumnData }));
    await getDbPerformanceIds("facilities", "mt10id");

    expect(getColumnData).toHaveBeenCalledWith("facilities", "mt10id");
  });
});
