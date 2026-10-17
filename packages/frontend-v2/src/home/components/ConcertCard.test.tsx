import { describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import posthog from "posthog-js";
import ConcertCard from "@/home/components/ConcertCard";
import type { Concert } from "@/types/concert";

vi.mock("posthog-js", () => ({
  default: { capture: vi.fn(), captureException: vi.fn() },
}));

/** ProgramReportDialog가 useMutation을 사용하므로 QueryClientProvider로 감싼다 */
const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
};

const makeConcert = (overrides: Partial<Concert> = {}): Concert => ({
  id: "PF1",
  name: "테스트 콘서트",
  poster: null,
  status: "ongoing",
  artists: ["아티스트A", "아티스트B"],
  periodFrom: "2026.10.16",
  periodTo: "2026.10.17",
  time: "금 20:00, 토 17:00",
  runtime: "110분",
  age: "만 7세 이상",
  venueName: "테스트홀",
  venueAddress: "서울특별시 테스트구 123",
  seatPrices: [
    { seatType: "R석", price: 100000 },
    { seatType: "S석", price: 50000 },
  ],
  minPrice: 50000,
  maxPrice: 100000,
  bookingLinks: [{ name: "테스트예매처", url: "https://tickets.example.com" }],
  programs: [
    {
      composerKo: "라흐마니노프",
      composerEn: "Rachmaninoff",
      titles: [
        { ko: "피아노 협주곡 2번", en: "Piano Concerto No. 2" },
        { ko: "녹턴", en: null },
      ],
    },
    {
      composerKo: "브람스",
      composerEn: "Brahms",
      titles: [{ ko: "헝가리안 댄스", en: "Hungarian Dances" }],
    },
  ],
  ...overrides,
});

describe("ConcertCard", () => {
  it("공연 상태는 공연중/공연예정 2가지 배지만 표기한다 (specs common-001)", () => {
    renderWithProviders(<ConcertCard concert={makeConcert({ status: "ongoing" })} />);
    expect(screen.getByText("공연중")).toBeInTheDocument();

    const { unmount } = renderWithProviders(
      <ConcertCard concert={makeConcert({ status: "upcoming" })} />,
    );
    expect(screen.getByText("공연예정")).toBeInTheDocument();
    unmount();
  });

  it("당일 공연은 하나의 날짜만 표기한다 (specs card-004)", () => {
    renderWithProviders(<ConcertCard concert={makeConcert({ periodTo: "2026.10.16" })} />);
    expect(screen.getByText("2026.10.16 (금)")).toBeInTheDocument();
    expect(screen.queryByText(/~/)).not.toBeInTheDocument();
  });

  it("프로그램이 없으면 프로그램 영역 전체를 렌더링하지 않는다 (specs card-007)", () => {
    renderWithProviders(<ConcertCard concert={makeConcert({ programs: [] })} />);
    expect(screen.queryByText("PROGRAM")).not.toBeInTheDocument();
    expect(screen.queryByText(/프로그램 작곡가:/)).not.toBeInTheDocument();
  });

  it("첫 곡 외 나머지 곡 수를 (외 N곡)으로 함께 표기한다 (specs card-008)", () => {
    renderWithProviders(<ConcertCard concert={makeConcert()} />);
    expect(screen.getByText("(외 2곡)")).toBeInTheDocument();
    expect(screen.getByText("라흐마니노프 - 피아노 협주곡 2번")).toBeInTheDocument();
  });

  it("곡 제목은 '작곡가 - 곡명' 형식으로 표기한다 (specs card-018)", () => {
    renderWithProviders(<ConcertCard concert={makeConcert()} />);
    expect(screen.getByText("라흐마니노프 - 피아노 협주곡 2번")).toBeInTheDocument();
  });

  it("작곡가가 없는 프로그램은 곡명만 표기한다 (specs card-018)", () => {
    renderWithProviders(
      <ConcertCard
        concert={makeConcert({
          programs: [
            { composerKo: null, composerEn: null, titles: [{ ko: "곡명만 있는 곡", en: null }] },
          ],
        })}
      />,
    );
    expect(screen.getByText("곡명만 있는 곡")).toBeInTheDocument();
  });

  it("검색어와 일치하는 곡을 프로그램 메인으로 표기한다 (specs search-008)", () => {
    renderWithProviders(<ConcertCard concert={makeConcert()} searchQuery="녹턴" />);
    expect(screen.getByText("라흐마니노프 - 녹턴")).toBeInTheDocument();
    expect(screen.queryByText("라흐마니노프 - 피아노 협주곡 2번")).not.toBeInTheDocument();
  });

  it("검색어가 다른 프로그램의 곡과 일치하면 그 곡을 메인으로 표기한다 (specs search-008)", () => {
    renderWithProviders(<ConcertCard concert={makeConcert()} searchQuery="브람스" />);
    expect(screen.getByText("브람스 - 헝가리안 댄스")).toBeInTheDocument();
  });

  it("일치하는 곡이 없으면 기본 곡(첫 프로그램 첫 곡)을 표기한다 (specs search-008)", () => {
    renderWithProviders(<ConcertCard concert={makeConcert()} searchQuery="차이콥스키" />);
    expect(screen.getByText("라흐마니노프 - 피아노 협주곡 2번")).toBeInTheDocument();
  });

  it("프로그램 작곡가 라벨과 작곡가명을 한 줄에 배치한다 (specs card-011)", () => {
    renderWithProviders(<ConcertCard concert={makeConcert()} />);
    const label = screen.getByText("프로그램 작곡가:");
    expect(label.parentElement).toHaveTextContent("라흐마니노프 · 브람스");
  });

  it("러닝타임/관람연령/공연 장소가 없으면 '-'를 표기한다 (specs card-012)", () => {
    renderWithProviders(
      <ConcertCard
        concert={makeConcert({ runtime: null, age: null, venueName: "" })}
      />,
    );
    expect(screen.getAllByText("-").length).toBeGreaterThanOrEqual(3);
  });

  it("티켓 가격이 무료면 '전석 무료'를 표기한다 (specs card-013)", () => {
    renderWithProviders(
      <ConcertCard
        concert={makeConcert({ seatPrices: [{ seatType: "전석", price: 0 }] })}
      />,
    );
    expect(screen.getByText("전석 무료")).toBeInTheDocument();
  });

  it("좌석별 가격이 없으면 가격 영역을 렌더링하지 않는다 (specs card-014)", () => {
    renderWithProviders(<ConcertCard concert={makeConcert({ seatPrices: [] })} />);
    expect(screen.queryByText("좌석별 티켓 가격:")).not.toBeInTheDocument();
  });

  it("공연장 상세 주소가 없으면 주소를 표기하지 않는다 (specs card-017)", () => {
    renderWithProviders(<ConcertCard concert={makeConcert({ venueAddress: null })} />);
    expect(screen.queryByText("서울특별시 테스트구 123")).not.toBeInTheDocument();
  });

  it("예매처는 첫 번째 링크의 이름과 URL을 사용한다 (specs card-015, card-016)", () => {
    renderWithProviders(
      <ConcertCard
        concert={makeConcert({
          bookingLinks: [
            { name: "첫째예매처", url: "https://first.example.com" },
            { name: "둘째예매처", url: "https://second.example.com" },
          ],
        })}
      />,
    );
    expect(screen.getByText("첫째예매처 공식 티켓 예매")).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /예매처 바로가기/ });
    expect(link).toHaveAttribute("href", "https://first.example.com");
  });

  it("예매처 바로가기 클릭 시 booking_click 이벤트를 수집한다", () => {
    renderWithProviders(<ConcertCard concert={makeConcert()} />);
    fireEvent.click(screen.getByRole("link", { name: /예매처 바로가기/ }));
    expect(posthog.capture).toHaveBeenCalledWith("booking_click", {
      concertId: "PF1",
      concertName: "테스트 콘서트",
      vendor: "테스트예매처",
    });
  });
});
