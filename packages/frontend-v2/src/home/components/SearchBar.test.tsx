import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import SearchBar from "@/home/components/SearchBar";

describe("SearchBar", () => {
  it("검색 버튼 클릭 시 현재 값을 onSubmit으로 전달한다", () => {
    const onSubmit = vi.fn();
    render(<SearchBar value="라흐" onChange={vi.fn()} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole("button", { name: "검색" }));
    expect(onSubmit).toHaveBeenCalledWith("라흐");
  });

  it("입력 시 onChange에 값을 전달한다", () => {
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} onSubmit={vi.fn()} />);
    fireEvent.change(screen.getByLabelText("공연 프로그램 검색"), {
      target: { value: "라흐" },
    });
    expect(onChange).toHaveBeenCalledWith("라흐");
  });

  it("초기화 버튼 클릭 시 빈 값으로 onSubmit을 호출하고 포커스를 되돌린다", () => {
    const onSubmit = vi.fn();
    render(<SearchBar value="라흐" onChange={vi.fn()} onSubmit={onSubmit} />);
    const clearButton = screen.getByRole("button", { name: "입력 초기화" });
    fireEvent.click(clearButton);
    expect(onSubmit).toHaveBeenCalledWith("");
    expect(screen.getByLabelText("공연 프로그램 검색")).toHaveFocus();
  });

  it("값이 없으면 초기화 버튼을 렌더링하지 않는다", () => {
    render(<SearchBar value="" onChange={vi.fn()} onSubmit={vi.fn()} />);
    expect(screen.queryByRole("button", { name: "입력 초기화" })).not.toBeInTheDocument();
  });
});
