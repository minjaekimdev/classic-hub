import type { Meta, StoryObj } from "@storybook/react-vite";
import HomeAlbumItem from "./HomeAlbumItem";

const meta = {
  title: "features/performance/AlbumItem",
  component: HomeAlbumItem,
  tags: ["autodocs"],
  args: {
    data: {
      id: "PF12345",
      rank: 1,
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
    },
  },
} satisfies Meta<typeof HomeAlbumItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    data: {
      ...meta.args.data,
      title:
        "동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세 무궁화 삼천리 화려강산 대한사람 대한으로 길이 보전하세",

      date: {
        start: "2026년 1월 13일 (목)",
        end: "2026년 1월 15일 (토)",
      },
      price: {
        min: 80000,
        max: 80000,
      },
    },
  },
};
