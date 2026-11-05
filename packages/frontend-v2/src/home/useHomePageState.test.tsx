import { describe, expect, it } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import useHomePageState from "@/home/useHomePageState";
import { getBrowsablePeriod } from "@/lib/period";

const createWrapper =
  (initialSearchParams = "") =>
  function HomePageStateTestWrapper({ children }: { children: React.ReactNode }) {
    return (
      <NuqsTestingAdapter hasMemory searchParams={initialSearchParams}>
        {children}
      </NuqsTestingAdapter>
    );
  };

describe("useHomePageState", () => {
  it("검색어 입력만으로는 URL에 반영되지 않는다 (specs search-009)", async () => {
    const { result } = renderHook(() => useHomePageState(), {
      wrapper: createWrapper(),
    });

    act(() => result.current.actions.onQueryInputChange("라흐"));

    expect(result.current.state.queryInput).toBe("라흐");
    expect(result.current.state.query).toBe("");

    // 검색 제출 디바운스(500ms)가 지나도 입력만으로는 커밋되지 않는다
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 700));
    });

    expect(result.current.state.query).toBe("");
  });

  it("검색 제출은 500ms 디바운스 후 URL에 커밋한다 (specs search-009)", async () => {
    const { result } = renderHook(() => useHomePageState(), {
      wrapper: createWrapper(),
    });

    act(() => result.current.actions.onQuerySubmit("베토벤"));

    expect(result.current.state.query).toBe("");

    await waitFor(() => expect(result.current.state.query).toBe("베토벤"));
  });

  it("연속 검색 제출 시 마지막 제출값만 커밋한다 (specs search-009)", async () => {
    const { result } = renderHook(() => useHomePageState(), {
      wrapper: createWrapper(),
    });

    act(() => result.current.actions.onQuerySubmit("라흐"));
    act(() => result.current.actions.onQuerySubmit("베토벤"));

    await waitFor(() => expect(result.current.state.query).toBe("베토벤"));
  });

  it("보기 모드는 기본값 리스트형이며 URL 파라미터로 복원된다 (specs view-001/002)", () => {
    const { result: defaultResult } = renderHook(() => useHomePageState(), {
      wrapper: createWrapper(),
    });
    expect(defaultResult.current.state.viewMode).toBe("list");

    const { result } = renderHook(() => useHomePageState(), {
      wrapper: createWrapper("?view=album"),
    });
    expect(result.current.state.viewMode).toBe("album");
  });

  it("유효하지 않은 view 파라미터는 리스트형으로 정규화한다 (specs view-002)", () => {
    const { result } = renderHook(() => useHomePageState(), {
      wrapper: createWrapper("?view=grid"),
    });
    expect(result.current.state.viewMode).toBe("list");
  });

  it("보기 모드 변경은 다른 조건(페이지 등)을 건드리지 않는다 (specs view-002)", async () => {
    const { result } = renderHook(() => useHomePageState(), {
      wrapper: createWrapper("?page=3"),
    });

    await waitFor(() => expect(result.current.state.page).toBe(3));

    act(() => result.current.actions.onViewModeChange("album"));

    await waitFor(() => expect(result.current.state.viewMode).toBe("album"));
    expect(result.current.state.page).toBe(3);
  });

  it("상태 필터 변경 시 페이지를 1로 리셋한다", async () => {
    const { result } = renderHook(() => useHomePageState(), {
      wrapper: createWrapper("?page=3"),
    });

    await waitFor(() => expect(result.current.state.page).toBe(3));

    act(() => result.current.actions.onStatusFilterChange("ongoing"));

    await waitFor(() => expect(result.current.state.page).toBe(1));
    expect(result.current.state.statusFilter).toBe("ongoing");
  });

  it("정렬 변경 시 페이지를 1로 리셋한다", async () => {
    const { result } = renderHook(() => useHomePageState(), {
      wrapper: createWrapper("?page=3"),
    });

    await waitFor(() => expect(result.current.state.page).toBe(3));

    act(() => result.current.actions.onSortByChange("price_desc"));

    await waitFor(() => expect(result.current.state.page).toBe(1));
    expect(result.current.state.sortBy).toBe("price_desc");
  });

  it("검색 필터 초기화는 모든 필터를 기본값(탐색 가능한 최대 기간 포함)으로 되돌린다 (specs search-007)", async () => {
    const { result } = renderHook(() => useHomePageState(), {
      wrapper: createWrapper("?q=라흐&status=ongoing&sort=price_desc&page=5"),
    });

    await waitFor(() => expect(result.current.state.page).toBe(5));

    act(() => result.current.actions.onResetFilters());

    await waitFor(() => {
      const state = result.current.state;
      expect(state.query).toBe("");
      expect(state.statusFilter).toBe("all");
      expect(state.sortBy).toBe("imminent");
      expect(state.page).toBe(1);
      expect(state.dateRange).toEqual(getBrowsablePeriod());
    });
  });

  it("URL 파라미터가 비어 있으면 탐색 가능한 전체 기간을 기본 사용한다 (specs exception-02)", () => {
    const { result } = renderHook(() => useHomePageState(), {
      wrapper: createWrapper(),
    });

    expect(result.current.state.dateRange).toEqual(getBrowsablePeriod());
  });
});
