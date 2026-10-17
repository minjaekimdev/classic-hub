import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
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
});
