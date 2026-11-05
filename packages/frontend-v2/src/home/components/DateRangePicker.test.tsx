import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import DateRangePicker from "@/home/components/DateRangePicker";
import { getBrowsablePeriod } from "@/lib/period";

describe("DateRangePicker", () => {
  it("초기화 버튼은 탐색 가능한 최대 기간으로 onChange를 호출한다 (specs search-005)", () => {
    const onChange = vi.fn();
    render(
      <DateRangePicker
        value={{ start: "2026-10-20", end: "2026-11-20" }}
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "기간 초기화" }));
    expect(onChange).toHaveBeenCalledWith(getBrowsablePeriod());
  });

  it("트리거 버튼에 현재 기간을 표시한다", () => {
    render(
      <DateRangePicker
        value={{ start: "2026-10-16", end: "2027-01-16" }}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByText("2026. 10. 16 ~ 2027. 01. 16")).toBeInTheDocument();
  });

  it("선택 중인 기간이 프리셋 범위와 일치하면 해당 프리셋이 선택 상태(aria-pressed)로 표시된다", () => {
    // 프리셋은 실행 시점의 오늘 날짜 기준으로 계산되므로, 확정히 겹치지 않는 과거 기간을 value로 사용한다
    render(
      <DateRangePicker
        value={{ start: "2020-01-01", end: "2020-02-01" }}
        onChange={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "2020. 01. 01 ~ 2020. 02. 01" }));
    const dialog = screen.getByRole("dialog", { name: "공연 기간 선택" });

    const todayPreset = within(dialog).getByRole("button", { name: "오늘" });
    expect(todayPreset).toHaveAttribute("aria-pressed", "false");

    // '오늘' 프리셋 선택 → draft(달력 선택 기간)가 오늘~오늘이 되어 활성 표시된다
    fireEvent.click(todayPreset);
    expect(todayPreset).toHaveAttribute("aria-pressed", "true");
  });
});
