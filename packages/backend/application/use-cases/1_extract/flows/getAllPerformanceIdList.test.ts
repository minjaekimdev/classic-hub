import { describe, it, expect, vi } from "vitest";
import {
  createGetAllPerformanceIdList,
  GetAllPerformanceIdListDeps,
} from "./getAllPerformanceIdList";
import { APIError } from "shared/utils/error";

// 헬퍼: 테스트에서의 deps 스텁을 쉽게 만든다. 필요한 부분만 overrides로 교체.
const makeDeps = (
  overrides: Partial<GetAllPerformanceIdListDeps> = {},
): GetAllPerformanceIdListDeps => ({
  fetchPage: vi.fn(),
  // 기본적으로 rateLimiter는 들어온 fn을 그대로 실행 (통과)
  // NOTE: 제네릭 <T>(fn) => Promise<T> 시그니처를 vi.fn이 완벽히 추론하지 못해 캐스팅.
  rateLimiter: {
    execute: vi.fn(<T>(fn: () => Promise<T>) => fn()) as any,
  },
  notify: vi.fn(),
  log: { debug: vi.fn(), warn: vi.fn(), info: vi.fn() },
  // 기본적으로 즉시 해결 → fake timer 불필요
  sleep: vi.fn().mockResolvedValue(undefined),
  ...overrides,
});

describe("getAllPerformanceIdList 비즈니스 로직 테스트", () => {
  // 시나리오 1: 정상 흐름
  it("페이지별로 데이터를 가져오다가 빈 배열을 만나면 전체 리스트를 반환하고 종료해야 한다", async () => {
    const fetchPage = vi
      .fn()
      .mockResolvedValueOnce(["ID_1", "ID_2"])
      .mockResolvedValueOnce(["ID_3"])
      .mockResolvedValueOnce([]);

    const getAllPerformanceIdList = createGetAllPerformanceIdList(
      makeDeps({ fetchPage }),
    );
    const result = await getAllPerformanceIdList("2026-06-01", "2026-06-30");

    expect(result).toEqual(["ID_1", "ID_2", "ID_3"]);
    expect(fetchPage).toHaveBeenCalledTimes(3);
  });

  // 시나리오 2: 일시적인 에러 발생 및 백오프 작동
  it("페칭에 실패하면 백오프 시간만큼 대기한 후 재시도하여 성공해야 한다", async () => {
    const fetchPage = vi
      .fn()
      .mockRejectedValueOnce(new Error("KOPIS 일시적 서버 다운"))
      .mockResolvedValueOnce(["ID_A"])
      .mockResolvedValueOnce([]);
    const sleep = vi.fn().mockResolvedValue(undefined);

    const getAllPerformanceIdList = createGetAllPerformanceIdList(
      makeDeps({ fetchPage, sleep }),
    );
    const result = await getAllPerformanceIdList("2026-06-01", "2026-06-30");

    expect(result).toEqual(["ID_A"]);
    expect(fetchPage).toHaveBeenCalledTimes(3);
    // 1차 백오프 = 3000 * 2^0 = 3000ms
    expect(sleep).toHaveBeenCalledWith(3000);
  });

  // 시나리오 3: 3번 연속 실패 시 알림 및 에러 발생
  it("maxRetries(3회)를 초과하여 실패하면 알림을 보내고 APIError를 던져야 한다", async () => {
    const fetchPage = vi
      .fn()
      .mockRejectedValue(new Error("KOPIS 지속적인 500 에러"));
    const notify = vi.fn();
    const sleep = vi.fn().mockResolvedValue(undefined);

    const getAllPerformanceIdList = createGetAllPerformanceIdList(
      makeDeps({ fetchPage, notify, sleep }),
    );

    await expect(
      getAllPerformanceIdList("2026-06-01", "2026-06-30"),
    ).rejects.toThrow(APIError);

    // 1차(3000ms), 2차(6000ms) 백오프 후 3회째에 throw → notify 호출
    expect(sleep).toHaveBeenCalledTimes(2);
    expect(sleep).toHaveBeenNthCalledWith(1, 3000);
    expect(sleep).toHaveBeenNthCalledWith(2, 6000);
    expect(notify).toHaveBeenCalledWith(
      expect.stringContaining(
        "[KOPIS_FAIL] 1 페이지에서 실패하여 전체 프로세스를 중단합니다.",
      ),
    );
  });

  // 시나리오 4: 페이지 성공 시 attempt가 초기화되는지 확인
  it("중간에 실패했다가 성공하면 이후 실패 카운트는 초기화되어야 한다", async () => {
    const fetchPage = vi
      .fn()
      .mockRejectedValueOnce(new Error("일시 에러")) // page 1 실패 (attempt 1)
      .mockResolvedValueOnce(["ID_1"]) // page 1 성공 → attempt 0으로 초기화
      .mockRejectedValueOnce(new Error("일시 에러")) // page 2 실패 (attempt 1)
      .mockResolvedValueOnce(["ID_2"]) // page 2 성공
      .mockResolvedValueOnce([]); // page 3 빈 배열 → 종료
    const sleep = vi.fn().mockResolvedValue(undefined);

    const getAllPerformanceIdList = createGetAllPerformanceIdList(
      makeDeps({ fetchPage, sleep }),
    );
    const result = await getAllPerformanceIdList("2026-06-01", "2026-06-30");

    expect(result).toEqual(["ID_1", "ID_2"]);
    expect(sleep).toHaveBeenCalledTimes(2); // 각각 1회씩만 재시도
  });

  // 시나리오 5: afterDate 옵션이 fetchPage에 전달되는지 확인
  it("afterDate 인자가 주어지면 fetchPage에 그대로 전달되어야 한다", async () => {
    const fetchPage = vi
      .fn()
      .mockResolvedValueOnce(["ID_1"])
      .mockResolvedValueOnce([]);

    const getAllPerformanceIdList = createGetAllPerformanceIdList(
      makeDeps({ fetchPage }),
    );
    await getAllPerformanceIdList("2026-06-01", "2026-06-30", "2026-01-01");

    expect(fetchPage).toHaveBeenCalledWith(
      "2026-06-01",
      "2026-06-30",
      1,
      "2026-01-01",
    );
  });
});
