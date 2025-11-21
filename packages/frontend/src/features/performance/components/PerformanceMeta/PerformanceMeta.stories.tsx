import "@app/styles/main.scss";
import type { Meta, StoryObj } from "@storybook/react-vite";
import PerformanceMeta from "./index";

const meta = {
  title: "Features/Performance/PerformanceMeta",
  component: PerformanceMeta,
  tags: ["autodocs"],
  args: {
    title: "조성진 피아노 리사이틀",
    artist: "조성진",
    stdate: "2025년 11월 30일 (목)",
    eddate: "2025년 11월 30일 (목)",
    time: "오후 7시 30분",
    hall: "예술의전당 콘서트홀",
  },
} satisfies Meta<typeof PerformanceMeta>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    title:
      "동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세 무궁화 삼천리 화려강산",
    stdate: "2025년 11월 30일 (목)",
    eddate: "2025년 12월 30일 (목)",
  },
};
