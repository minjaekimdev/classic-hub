import { describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import posthog from "posthog-js";
import ConcertCardAlbum from "@/home/components/ConcertCardAlbum";
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

describe("ConcertCardAlbum", () => {
  it("공연명·상태 배지·날짜·장소를 렌더링한다 (specs common-001, card-003/004)", () => {
    renderWithProviders(<ConcertCardAlbum concert={makeConcert()} />);

    expect(screen.getByText("테스트 콘서트")).toBeInTheDocument();
    expect(screen.getByText("공연중")).toBeInTheDocument();
    expect(screen.getByText("테스트홀")).toBeInTheDocument();
    expect(screen.getByText("서울특별시 테스트구 123")).toBeInTheDocument();
  });

  it("곡 제목은 '작곡가 - 곡명' 형식과 (외 N곡)을 표기한다 (specs card-008/018)", () => {
    renderWithProviders(<ConcertCardAlbum concert={makeConcert()} />);

    expect(screen.getByText("라흐마니노프 - 피아노 협주곡 2번")).toBeInTheDocument();
    expect(screen.getByText("(외 2곡)")).toBeInTheDocument();
    expect(screen.getByText("총 3곡 연주")).toBeInTheDocument();
  });

  it("검색어와 일치하는 곡을 프로그램 메인으로 표기한다 (specs search-008)", () => {
    renderWithProviders(<ConcertCardAlbum concert={makeConcert()} searchQuery="녹턴" />);

    expect(screen.getByText("라흐마니노프 - 녹턴")).toBeInTheDocument();
    expect(screen.queryByText("라흐마니노프 - 피아노 협주곡 2번")).not.toBeInTheDocument();
  });

  it("모바일 전용 '전체 프로그램 보기' 버튼 없이 hover 팝오버만 렌더링한다 (specs view-004)", () => {
    renderWithProviders(<ConcertCardAlbum concert={makeConcert()} />);

    expect(screen.queryByRole("button", { name: "전체 프로그램 보기" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /오류 제보/ })).toBeInTheDocument();
  });

  it("카드에 '프로그램 작곡가'·러닝타임·관람연령 블록을 표기하지 않는다 (2026.10.23 제외 확정)", () => {
    renderWithProviders(<ConcertCardAlbum concert={makeConcert()} />);
    expect(screen.queryByText(/프로그램 작곡가:/)).not.toBeInTheDocument();
    expect(screen.queryByText("러닝타임")).not.toBeInTheDocument();
    expect(screen.queryByText("관람연령")).not.toBeInTheDocument();
  });

  it("예매처는 첫 번째 링크로 연결되고 클릭 시 booking_click 이벤트를 수집한다 (specs card-016)", async () => {
    renderWithProviders(
      <ConcertCardAlbum
        concert={makeConcert({
          bookingLinks: [
            { name: "첫째예매처", url: "https://first.example.com" },
            { name: "둘째예매처", url: "https://second.example.com" },
          ],
        })}
      />,
    );

    const link = screen.getByRole("link", { name: /예매처 바로가기/ });
    expect(link).toHaveAttribute("href", "https://first.example.com");

    fireEvent.click(link);
    expect(posthog.capture).toHaveBeenCalledWith("booking_click", {
      concertId: "PF1",
      concertName: "테스트 콘서트",
      vendor: "첫째예매처",
    });
  });
});
