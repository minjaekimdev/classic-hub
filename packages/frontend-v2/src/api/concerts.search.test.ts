import { describe, expect, it } from "vitest";
import { buildSearchRpcArgs } from "@/api/concerts";

describe("buildSearchRpcArgs (specs search-002)", () => {
  const dateRange = { start: "2026-10-16", end: "2027-01-16" };

  it("검색 파라미터를 search_concerts RPC 인자로 변환한다", () => {
    expect(
      buildSearchRpcArgs(
        {
          query: "쇼팽 피아노 협주곡",
          statusFilter: "all",
          dateRange,
          sortBy: "imminent",
          page: 1,
          pageSize: 10,
        },
        "2026-10-16",
      ),
    ).toEqual({
      p_keyword: "쇼팽 피아노 협주곡",
      p_status: "all",
      p_period_from: "2026.10.16",
      p_period_to: "2027.01.16",
      p_sort: "imminent",
      p_page: 1,
      p_page_size: 10,
      p_today: "2026.10.16",
    });
  });

  it("공백뿐인 검색어는 빈 문자열로 전달한다 (RPC가 전체 조회로 처리)", () => {
    const args = buildSearchRpcArgs(
      { query: "   ", statusFilter: "ongoing", dateRange, sortBy: "price_asc", page: 2 },
      "2026-10-16",
    );
    expect(args.p_keyword).toBe("");
    expect(args.p_status).toBe("ongoing");
    expect(args.p_sort).toBe("price_asc");
  });
});
