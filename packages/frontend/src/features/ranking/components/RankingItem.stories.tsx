import type { Meta, StoryObj } from '@storybook/react-vite';
import RankingItem from './RankingItem';

const meta = {
  title: 'Features/ranking/RankingItem',
  component: RankingItem,
  tags: ['autodocs'],
  args: { 
    rank: "1",
    posterUrl: "http://www.kopis.or.kr/upload/pfmPoster/PF_PF278593_251111_135635.gif",
    name: "크리스티안 짐머만 피아노 리사이틀 [서울]",
    artist: "크리스티안 짐머만",
    date: "2026년 1월 5일 (목)",
    location: "롯데콘서트홀",
  },
} satisfies Meta<typeof RankingItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
};

export const Secondary: Story = {
  args: {
    rank: "4"
  }
};
