import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import ResponsiveDialog from "@/components/ResponsiveDialog";

describe("ResponsiveDialog", () => {
  it("isOpen이 false면 렌더링하지 않는다", () => {
    render(
      <ResponsiveDialog isOpen={false} onClose={vi.fn()} ariaLabel="테스트 다이얼로그">
        <p>내용</p>
      </ResponsiveDialog>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("isOpen이 true면 dialog를 렌더링한다", () => {
    render(
      <ResponsiveDialog isOpen onClose={vi.fn()} ariaLabel="테스트 다이얼로그">
        <p>내용</p>
      </ResponsiveDialog>,
    );
    expect(screen.getByRole("dialog", { name: "테스트 다이얼로그" })).toBeInTheDocument();
  });

  it("Escape 키로 onClose를 호출한다", () => {
    const onClose = vi.fn();
    render(
      <ResponsiveDialog isOpen onClose={onClose} ariaLabel="테스트 다이얼로그">
        <p>내용</p>
      </ResponsiveDialog>,
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("배경 클릭으로 onClose를 호출하고, 내부 클릭은 닫지 않는다", () => {
    const onClose = vi.fn();
    render(
      <ResponsiveDialog isOpen onClose={onClose} ariaLabel="테스트 다이얼로그">
        <p>내용</p>
      </ResponsiveDialog>,
    );
    fireEvent.click(screen.getByRole("dialog"));
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("dialog").parentElement!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
