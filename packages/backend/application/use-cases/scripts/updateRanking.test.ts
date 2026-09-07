import { describe, it, expect, vi } from "vitest";
import { createUpdateRanking } from "./updateRanking";
import { Ranking } from "@/shared/types/kopis";

const makeRanking = (id: string): Ranking => ({
  rnum: "1",
  prfnm: `공연 ${id}`,
  prfpd: "2026.09.01~2026.09.30",
  prfplcnm: "예술의전당",
  seatcnt: "5000",
  prfdtcnt: "10",
  area: "서울",
  poster: "http://example.com/poster.jpg",
  mt20id: id,
});

// 헬퍼: 테스트에서의 deps 스텁을 쉽게 만든다. 필요한 부분만 overrides로 교체.
const makeDeps = (overrides = {}) => ({
  getRanking: vi.fn().mockResolvedValue([makeRanking("PF1")]),
  updateRanks: vi.fn().mockResolvedValue(undefined),
  log: { error: vi.fn() },
  notify: vi.fn().mockResolvedValue(undefined),
  ...overrides,
});

describe("updateRanking 비즈니스 로직 테스트", () => {
  it("조회한 랭킹을 period와 함께 DB에 반영한다", async () => {
    const deps = makeDeps();
    const updateRanking = createUpdateRanking(deps);

    await updateRanking("daily", "20260906", "20260906");

    expect(deps.getRanking).toHaveBeenCalledWith("20260906", "20260906");
    expect(deps.updateRanks).toHaveBeenCalledWith("daily", [makeRanking("PF1")]);
    expect(deps.log.error).not.toHaveBeenCalled();
    expect(deps.notify).not.toHaveBeenCalled();
  });

  it("조회 결과가 null이면 DB 반영 없이 FETCH_FAIL 알림을 보낸다", async () => {
    const deps = makeDeps({ getRanking: vi.fn().mockResolvedValue(null) });
    const updateRanking = createUpdateRanking(deps);

    await updateRanking("weekly", "20260831", "20260906");

    expect(deps.updateRanks).not.toHaveBeenCalled();
    expect(deps.log.error).toHaveBeenCalledWith(
      "[FETCH_FAIL] ranking data fetch failed: 20260831 ~ 20260906",
      { service: "kopis" },
    );
    expect(deps.notify).toHaveBeenCalledWith(
      "[FETCH_FAIL] ranking data fetch failed: 20260831 ~ 20260906",
    );
  });

  it("DB 반영이 실패하면 에러를 삼키고 UPDATE_FAILED 알림만 보낸다 (다음 period를 죽이지 않기 위함)", async () => {
    const deps = makeDeps({
      updateRanks: vi.fn().mockRejectedValue(new Error("rpc failed")),
    });
    const updateRanking = createUpdateRanking(deps);

    await expect(
      updateRanking("daily", "20260906", "20260906"),
    ).resolves.toBeUndefined();

    expect(deps.notify).toHaveBeenCalledWith(
      expect.stringContaining("[UPDATE_FAILED] daily ranking data update failed"),
    );
  });

  it("조회 자체의 네트워크 오류는 삼키지 않고 그대로 전파한다 (정책은 상위 경계가 담당)", async () => {
    const deps = makeDeps({
      getRanking: vi.fn().mockRejectedValue(new Error("KOPIS down")),
    });
    const updateRanking = createUpdateRanking(deps);

    await expect(
      updateRanking("daily", "20260906", "20260906"),
    ).rejects.toThrow("KOPIS down");

    expect(deps.updateRanks).not.toHaveBeenCalled();
    expect(deps.notify).not.toHaveBeenCalled();
  });
});
