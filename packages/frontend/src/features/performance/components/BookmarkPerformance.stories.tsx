import type { Meta, StoryObj } from '@storybook/react-vite';
import BookmarkPerformance from './BookmarkPerformance';

const meta = {
  title: 'features/performance/BookmarkPerformance',
  component: BookmarkPerformance,
  tags: ['autodocs'],
  args: { 
    posterUrl: "http://www.kopis.or.kr/upload/pfmPoster/PF_PF278683_251110_154558.gif",
    name: "베토벤 교향곡 9번 \"합창\"",
    artist: "서울시립교향악단",
    date: "2025년 10월 15일 (수)",
    hall: "예술의전당 콘서트홀",
  },
} satisfies Meta<typeof BookmarkPerformance>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
};

export const Secondary: Story = {
  args: {
    name: "동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세 무궁화 삼천리 화려강산 대한사람 대한으로 길이 보전하세"
  }
};
