import type { Meta, StoryObj } from "@storybook/react-vite";
import ResultPerformanceAlbumCard from "./ResultPerformanceAlbumCard";

const meta = {
  title: "Features/Module/ResultPerformanceAlbumCard",
  component: ResultPerformanceAlbumCard,
  tags: ["autodocs"],
  args: {
    data: {
      // 1. 일반적인 정기 연주회 (곡이 여러 개인 경우)
      id: "perf-001",
      performance_name: "서울시향의 마스터피스 시리즈: 말러 교향곡 5번",
      title: "서울시향의 마스터피스 시리즈: 말러 교향곡 5번",
      cast: "지휘 에드워드 가드너, 협연 손열음(피아노)",
      poster: "https://example.com/posters/mahler5.jpg",
      venueId: "v-123",
      venue: "예술의전당 콘서트홀",
      time: "19:30",
      runningTime: "120분 (인터미션 15분)",
      age: "초등학생 이상 관람가",
      area: "서울",
      minPrice: 30000,
      maxPrice: 150000,
      startDate: "2026-05-20",
      endDate: "2026-05-20",
      priceInfo: [
        { seatType: "R", price: 150000 },
        { seatType: "S", price: 120000 },
        { seatType: "A", price: 80000 },
        { seatType: "B", price: 30000 },
      ],
      detailImages: ["https://example.com/details/mahler-info.jpg"],
      bookingLinks: [
        { name: "인터파크", url: "https://interpark.com/123" },
        { name: "예술의전당", url: "https://sac.or.kr/456" },
      ],
      program: [
        {
          composer_name: "모차르트",
          composer_name_en: "Wolfgang Amadeus Mozart",
          work_title: "피아노 협주곡 21번 C장조, K. 467",
          work_title_en: "Piano Concerto No. 21 in C Major, K. 467",
          sequence: 1,
        },
        {
          id: "prog-2",
          performance_id: "perf-001",
          composer_name: "말러",
          composer_name_en: "Gustav Mahler",
          work_title: "교향곡 제5번 c#단조",
          work_title_en: "Symphony No. 5 in C-sharp Minor",
          sequence: 2,
        },
      ],
    },
  },
} satisfies Meta<typeof ResultPerformanceAlbumCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {},
};
