import type { Meta, StoryObj } from "@storybook/react-vite";
import PerformanceCardHome from "./index";

const meta = {
  title: "Features/Performance/PerformanceCardHome",
  component: PerformanceCardHome,
  tags: ["autodocs"],
  args: {
    data: {
      imgSrc:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF277927_251031_170022.jpg",
      title: "피아니스트 김정원 전국 투어",
      artist: "김정원",
      date: "2025년 11월 15일 (목)",
      time: "오후 8시",
      location: "롯데콘서트홀",
      price: "100,000",
    },
  },
} satisfies Meta<typeof PerformanceCardHome>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    data: {
      imgSrc:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF277927_251031_170022.jpg",
      title:
        "뉴욕 링컨센터 실내악협회 단독 내한공연: 브람스와 슈만 듀오가나다라마바사",
      artist: "김정원",
      date: "2025년 11월 15일 (목)",
      time: "오후 8시",
      location: "롯데콘서트홀",
      price: "100,000",
    },
  },
};
