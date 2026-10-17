import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import StatusTabs from "@/home/components/StatusTabs";
import type { ConcertStatusCounts } from "@/types/concert";

const counts: ConcertStatusCounts = { all: 3, ongoing: 2, upcoming: 1 };

describe("StatusTabs", () => {
  it("전체/공연중/공연예정 탭에 해당 상태의 공연 개수를 표시한다 (specs search-004)", () => {
    render(<StatusTabs value="all" onChange={vi.fn()} counts={counts} />);
    expect(screen.getByText("전체 (3)")).toBeInTheDocument();
    expect(screen.getByText("공연중 (2)")).toBeInTheDocument();
    expect(screen.getByText("공연예정 (1)")).toBeInTheDocument();
  });

  it("카운트가 아직 없으면 (-)로 표시한다", () => {
    render(<StatusTabs value="all" onChange={vi.fn()} counts={undefined} />);
    expect(screen.getByText("전체 (-)")).toBeInTheDocument();
  });

  it("탭을 클릭하면 해당 상태 값으로 onChange를 호출한다", () => {
    const onChange = vi.fn();
    render(<StatusTabs value="all" onChange={onChange} counts={counts} />);
    fireEvent.click(screen.getByText("공연중 (2)"));
    expect(onChange).toHaveBeenCalledWith("ongoing");
  });
});
