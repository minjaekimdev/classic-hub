import { describe, it, expect, vi } from "vitest";
import { createExtractPerformances } from "./extractPerformances";
import { PerformanceDetail } from "shared/types/kopis";

// 헬퍼: 테스트에서의 deps 스텁을 쉽게 만든다. 필요한 부분만 overrides로 교체.
const makeDeps = (overrides: Partial<Parameters<typeof createExtractPerformances>[0]> = {}) => ({
  getDbPerformanceIds: vi.fn().mockResolvedValue([]),
  compareNewOld: vi.fn().mockReturnValue({ idsToDelete: [], idsToInsert: [] }),
  getAllPerformanceIdList: vi.fn().mockResolvedValue([]),
  getPerformanceDetailList: vi
    .fn()
    .mockResolvedValue({ performances: [], failures: [] }),
  log: { info: vi.fn() },
  ...overrides,
});

// 헬퍼: 최소한의 PerformanceDetail 스텁 생성
const makeDetail = (id: string, overrides: Partial<PerformanceDetail> = {}) =>
  ({
    mt20id: id,
    mt10id: "FC001431",
    prfnm: `공연-${id}`,
    prfpdfrom: "2026.01.01",
    prfpdto: "2026.06.30",
    fcltynm: "공연장",
    prfcast: "",
    prfcrew: "",
    prfruntime: "",
    prfage: "",
    entrpsnmP: "",
    entrpsnmA: "",
    entrpsnmH: "",
    entrpsnmS: "",
    pcseguidance: "",
    poster: "http://poster",
    sty: "",
    area: "서울",
    genrenm: "연극",
    prfstate: "공연중",
    openrun: "N" as const,
    visit: "N" as const,
    child: "N" as const,
    daehakro: "N" as const,
    festival: "N" as const,
    musicallicense: "N" as const,
    musicalcreate: "N" as const,
    updatedate: "2026-07-22",
    relates: { relate: { relatenm: "예매처", relateurl: "http://booking" } },
    styurls: { styurl: [] },
    dtguidance: "",
    ...overrides,
  }) as unknown as PerformanceDetail;

describe("extractPerformances 오케스트레이션 테스트", () => {
  // 시나리오 1: 정상 흐름 - 모든 단계가 성공
  it("전체 파이프라인을 순서대로 실행하여 performances와 idsToDelete를 반환해야 한다", async () => {
    const dbIds = ["ID_3"];
    const compareNewOld = vi
      .fn()
      .mockReturnValue({ idsToDelete: ["ID_3"], idsToInsert: ["ID_1", "ID_2"] });
    const getAllPerformanceIdList = vi
      .fn()
      .mockResolvedValueOnce(["ID_1", "ID_2"]) // 1차 호출: 새 공연 id
      .mockResolvedValueOnce([]); // 2차 호출: 수정 공연 id (없음)
    const getPerformanceDetailList = vi
      .fn()
      .mockResolvedValue({
        performances: [makeDetail("ID_1"), makeDetail("ID_2")],
        failures: [],
      });

    const extractPerformances = createExtractPerformances(
      makeDeps({
        getDbPerformanceIds: vi.fn().mockResolvedValue(dbIds),
        compareNewOld,
        getAllPerformanceIdList,
        getPerformanceDetailList,
      }),
    );

    const result = await extractPerformances("2026-01-01", "2026-06-30", "2026-07-01", "2026-07-31");

    expect(result.idsToDelete).toEqual(["ID_3"]);
    expect(result.detailFetchFailures).toEqual([]);
    expect(result.performances).toHaveLength(2);
    expect(result.performances[0]!.mt20id).toBe("ID_1");
    expect(result.performances[1]!.mt20id).toBe("ID_2");
  });

  // 시나리오 2: getAllPerformanceIdList를 2회 호출 (새 id / 수정 id)
  it("getAllPerformanceIdList는 새 id 페칭과 수정 id 페칭으로 총 2회 호출되어야 한다", async () => {
    const getAllPerformanceIdList = vi
      .fn()
      .mockResolvedValueOnce(["ID_1"]) // 1차: startDate ~ endDate
      .mockResolvedValueOnce(["ID_2"]); // 2차: startDate ~ updateEndDate (afterDate)

    const extractPerformances = createExtractPerformances(
      makeDeps({ getAllPerformanceIdList }),
    );

    await extractPerformances("2026-01-01", "2026-06-30", "2026-07-01", "2026-07-31");

    expect(getAllPerformanceIdList).toHaveBeenCalledTimes(2);
    // 1차 호출: 새 id (startDate, endDate)
    expect(getAllPerformanceIdList).toHaveBeenNthCalledWith(1, "2026-01-01", "2026-06-30");
    // 2차 호출: 수정 id (startDate, updateEndDate, afterDate)
    expect(getAllPerformanceIdList).toHaveBeenNthCalledWith(
      2,
      "2026-01-01",
      "2026-07-31",
      "2026-07-01",
    );
  });

  // 시나리오 3: idsToInsert와 idsToUpdate에 같은 id가 있으면 중복 제거
  it("idsToInsert와 idsToUpdate에 동일한 id가 있어도 transform은 1번만 수행되어야 한다", async () => {
    const compareNewOld = vi.fn().mockReturnValue({
      idsToDelete: [],
      idsToInsert: ["ID_1", "ID_2"],
    });
    const getAllPerformanceIdList = vi
      .fn()
      .mockResolvedValueOnce(["ID_1", "ID_2"]) // 1차: 새 id
      .mockResolvedValueOnce(["ID_2", "ID_3"]); // 2차: 수정 id
    const getPerformanceDetailList = vi.fn().mockResolvedValue({
      performances: [makeDetail("ID_1"), makeDetail("ID_2"), makeDetail("ID_3")],
      failures: [],
    });

    const extractPerformances = createExtractPerformances(
      makeDeps({ compareNewOld, getAllPerformanceIdList, getPerformanceDetailList }),
    );

    await extractPerformances("2026-01-01", "2026-06-30", "2026-07-01", "2026-07-31");

    // ID_2가 양쪽에 있지만 중복 제거되어 [ID_1, ID_2, ID_3]만 전달
    expect(getPerformanceDetailList).toHaveBeenCalledWith(["ID_1", "ID_2", "ID_3"]);
  });

  // 시나리오 4: 상세 데이터는 변환 없이 원본 그대로 반환된다 (이미지 페칭은 transform 담당)
  it("getPerformanceDetailList의 결과를 변환 없이 performances로 그대로 반환해야 한다", async () => {
    const detail1 = makeDetail("ID_1", { styurls: { styurl: "http://single-detail" } });
    const detail2 = makeDetail("ID_2", { poster: "", styurls: { styurl: [] } });
    const getPerformanceDetailList = vi
      .fn()
      .mockResolvedValue({ performances: [detail1, detail2], failures: [] });

    const extractPerformances = createExtractPerformances(
      makeDeps({ getPerformanceDetailList }),
    );

    const result = await extractPerformances("2026-01-01", "2026-06-30", "2026-07-01", "2026-07-31");

    // 원본 객체가 그대로 통과되는지 (동일성) 검증
    expect(result.performances[0]).toBe(detail1);
    expect(result.performances[1]).toBe(detail2);
  });

  // 시나리오 5: getDbPerformanceIds가 고정 인자로 호출되는지 확인
  it("getDbPerformanceIds는 performances 테이블과 performance_id 컬럼으로 호출되어야 한다", async () => {
    const getDbPerformanceIds = vi.fn().mockResolvedValue([]);

    const extractPerformances = createExtractPerformances(
      makeDeps({ getDbPerformanceIds }),
    );

    await extractPerformances("2026-01-01", "2026-06-30", "2026-07-01", "2026-07-31");

    expect(getDbPerformanceIds).toHaveBeenCalledWith("performances", "performance_id");
  });

  // 시나리오 6: compareNewOld에 newIds와 dbIds가 올바르게 전달되는지 확인
  it("compareNewOld에 새 id 목록과 DB id 목록이 그대로 전달되어야 한다", async () => {
    const compareNewOld = vi.fn().mockReturnValue({ idsToDelete: [], idsToInsert: [] });
    const getAllPerformanceIdList = vi
      .fn()
      .mockResolvedValueOnce(["ID_1", "ID_2"])
      .mockResolvedValueOnce([]);
    const getDbPerformanceIds = vi.fn().mockResolvedValue(["ID_3"]);

    const extractPerformances = createExtractPerformances(
      makeDeps({ compareNewOld, getAllPerformanceIdList, getDbPerformanceIds }),
    );

    await extractPerformances("2026-01-01", "2026-06-30", "2026-07-01", "2026-07-31");

    expect(compareNewOld).toHaveBeenCalledWith(["ID_1", "ID_2"], ["ID_3"]);
  });

  // 시나리오 7: 1차 getAllPerformanceIdList 실패 시 에러 전파
  it("첫 번째 getAllPerformanceIdList가 실패하면 에러를 상위로 전파해야 한다", async () => {
    const error = new Error("KOPIS 실패");
    const getAllPerformanceIdList = vi.fn().mockRejectedValue(error);

    const extractPerformances = createExtractPerformances(
      makeDeps({ getAllPerformanceIdList }),
    );

    await expect(
      extractPerformances("2026-01-01", "2026-06-30", "2026-07-01", "2026-07-31"),
    ).rejects.toThrow(error);

    // 1차 실패 시 이후 단계는 실행되지 않아야 함
    expect(getAllPerformanceIdList).toHaveBeenCalledTimes(1);
  });

  // 시나리오 8: transform할 id가 없으면 빈 결과 반환
  it("삽입/수정 대상이 모두 없으면 빈 performances와 idsToDelete만 반환해야 한다", async () => {
    const compareNewOld = vi.fn().mockReturnValue({
      idsToDelete: ["ID_OLD"],
      idsToInsert: [],
    });
    const getAllPerformanceIdList = vi
      .fn()
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);
    const getPerformanceDetailList = vi.fn().mockResolvedValue({
      performances: [],
      failures: [],
    });

    const extractPerformances = createExtractPerformances(
      makeDeps({
        compareNewOld,
        getAllPerformanceIdList,
        getPerformanceDetailList,
      }),
    );

    const result = await extractPerformances("2026-01-01", "2026-06-30", "2026-07-01", "2026-07-31");

    expect(result.performances).toEqual([]);
    expect(result.idsToDelete).toEqual(["ID_OLD"]);
    expect(result.detailFetchFailures).toEqual([]);
  });

  // 시나리오 9: 상세 페칭 실패 목록은 detailFetchFailures로 그대로 반환된다
  it("상세 페칭 실패 목록을 detailFetchFailures로 반환해야 한다", async () => {
    const failures = [
      { id: "ID_X", error: "DetailFetchError", failedAt: "2026-09-08T00:00:00.000Z" },
    ];
    const getPerformanceDetailList = vi.fn().mockResolvedValue({
      performances: [],
      failures,
    });

    const extractPerformances = createExtractPerformances(
      makeDeps({ getPerformanceDetailList }),
    );

    const result = await extractPerformances("2026-01-01", "2026-06-30", "2026-07-01", "2026-07-31");

    expect(result.performances).toEqual([]);
    expect(result.detailFetchFailures).toEqual(failures);
  });
});
