import type { Meta, StoryObj } from "@storybook/react-vite";
import PerformanceListItem from "./ListItem";

const DEFAULT_DATA = {
  id: "PF12345",
  posterUrl:
    "http://www.kopis.or.kr/upload/pfmPoster/PF_PF278593_251111_135635.gif",
  title: "크리스티안 짐머만 피아노 리사이틀",
  artist: "크리스티안 짐머만",
  composerArray: ["베토벤", "리스트", "라흐마니노프"],
  date: {
    start: "2026년 1월 13일 (목)",
    end: "2026년 1월 13일 (목)",
  },
  time: "오후 8시 30분",
  venue: "롯데콘서트홀",
  price: {
    min: 80000,
    max: 180000,
  },
};

const meta = {
  title: "features/performance/ListItem",
  component: PerformanceListItem,
  tags: ["autodocs"],
  args: {
    data: DEFAULT_DATA,
  },
} satisfies Meta<typeof PerformanceListItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    data: {
      ...DEFAULT_DATA,
      composerArray: [
        "베토벤",
        "리스트",
        "라흐마니노프",
        "베토벤",
        "리스트",
        "라흐마니노프",
        "베토벤",
        "리스트",
        "라흐마니노프",
        "베토벤",
        "리스트",
        "라흐마니노프",
      ],
    },
  },
};
