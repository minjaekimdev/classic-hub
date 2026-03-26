import type { Meta, StoryObj } from "@storybook/react-vite";
import ResultPerformanceAlbumCard from "./ResultPerformanceAlbumCard";

const meta = {
  title: "performance/ui/ResultPerformanceAlbumCard",
  component: ResultPerformanceAlbumCard,
  tags: ["autodocs"],
  args: {
    data: {
      // 1. 일반적인 정기 연주회 (곡이 여러 개인 경우)
      id: "perf-001",
      title: "서울시향의 마스터피스 시리즈: 말러 교향곡 5번",
      artist: "지휘 에드워드 가드너, 협연 손열음(피아노)",
      poster: "https://example.com/posters/mahler5.jpg",
      venueId: "v-123",
      venue: "예술의전당 콘서트홀",
      area: "서울",
      minPrice: 30000,
      maxPrice: 150000,
      startDate: "2026-05-20",
      endDate: "2026-05-20",
      bookingLinks: [
        { name: "인터파크", url: "https://interpark.com/123" },
        { name: "예술의전당", url: "https://sac.or.kr/456" },
      ],
      programs: [
        {
          composerKo: "모차르트",
          composerEn: "Wolfgang Amadeus Mozart",
          workTitleKr: ["피아노 협주곡 21번 C장조, K. 467"],
          workTitleEn: ["Piano Concerto No. 21 in C Major, K. 467"],
        },
        {
          composerKo: "말러",
          composerEn: "Gustav Mahler",
          workTitleKr: ["교향곡 제5번 c#단조", "교향곡 9번"],
          workTitleEn: ["Symphony No. 5 in C-sharp Minor", "Symphony No. 9"],
        },
      ],
    },
  },
} satisfies Meta<typeof ResultPerformanceAlbumCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

// 키워드가 존재하고 해당 키워드가 프로그램에 존재하는 경우
export const Secondary: Story = {
  args: {},
};
