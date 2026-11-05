import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import SearchBar from "@/home/components/SearchBar";

describe("SearchBar", () => {
  it("검색어 라벨과 함께 입력 필드를 렌더링한다 (specs search-001)", () => {
    render(<SearchBar value="" onChange={vi.fn()} onClear={vi.fn()} />);
    expect(screen.getByText("검색어")).toBeInTheDocument();
    expect(screen.getByLabelText("공연 프로그램 검색")).toBeInTheDocument();
  });

  it("입력 시 onChange에 값을 전달한다 (specs search-009 — 커밋은 검색 버튼에서만)", () => {
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} onClear={vi.fn()} />);
    fireEvent.change(screen.getByLabelText("공연 프로그램 검색"), {
      target: { value: "라흐" },
    });
    expect(onChange).toHaveBeenCalledWith("라흐");
  });

  it("초기화 버튼 클릭 시 onClear를 호출하고 포커스를 되돌린다", () => {
    const onClear = vi.fn();
    render(<SearchBar value="라흐" onChange={vi.fn()} onClear={onClear} />);
    const clearButton = screen.getByRole("button", { name: "입력 초기화" });
    fireEvent.click(clearButton);
    expect(onClear).toHaveBeenCalled();
    expect(screen.getByLabelText("공연 프로그램 검색")).toHaveFocus();
  });

  it("값이 없으면 초기화 버튼을 렌더링하지 않는다", () => {
    render(<SearchBar value="" onChange={vi.fn()} onClear={vi.fn()} />);
    expect(screen.queryByRole("button", { name: "입력 초기화" })).not.toBeInTheDocument();
  });

  it("검색 예시가 롤링 placeholder로 렌더링된다 (specs search-001)", () => {
    render(<SearchBar value="" onChange={vi.fn()} onClear={vi.fn()} />);
    expect(screen.getByText("예:")).toBeInTheDocument();
    // 롤링 트랙은 1번 예시를 복제해 끊김 없이 순환한다
    expect(screen.getAllByText("라흐마니노프 피아노 협주곡 3번").length).toBe(2);
    expect(screen.getByText("조성진")).toBeInTheDocument();
    expect(screen.getByText("예술의전당 콘서트홀")).toBeInTheDocument();
  });
});
