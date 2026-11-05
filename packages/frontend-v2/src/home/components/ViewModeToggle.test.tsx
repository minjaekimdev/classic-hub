import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import ViewModeToggle from "@/home/components/ViewModeToggle";

describe("ViewModeToggle", () => {
  it("앨범형/리스트형 두 옵션을 렌더링하고 현재 값은 pressed 상태다 (specs view-001)", () => {
    render(<ViewModeToggle value="list" onChange={vi.fn()} />);

    const albumButton = screen.getByRole("button", { name: "앨범형" });
    const listButton = screen.getByRole("button", { name: "리스트형" });

    expect(albumButton).toHaveAttribute("aria-pressed", "false");
    expect(listButton).toHaveAttribute("aria-pressed", "true");
  });

  it("옵션 클릭 시 해당 보기 모드로 onChange를 호출한다 (specs view-001)", () => {
    const onChange = vi.fn();
    render(<ViewModeToggle value="list" onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "앨범형" }));
    expect(onChange).toHaveBeenCalledWith("album");

    fireEvent.click(screen.getByRole("button", { name: "리스트형" }));
    expect(onChange).toHaveBeenCalledWith("list");
  });
});
