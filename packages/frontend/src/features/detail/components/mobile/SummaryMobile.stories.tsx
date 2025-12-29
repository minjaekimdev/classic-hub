import type { Meta, StoryObj } from '@storybook/react-vite';
import SummaryMobile from './SummaryMobile';

const meta = {
  title: 'features/detail/mobile/SummaryMobile',
  component: SummaryMobile,
  tags: ['autodocs'],
  args: { 
    title: "라 트라비아타",
    artist: "국립오페라단",
    date: {
      start: "2025년 11월 22일 (토)",
      end: "2025년 11월 22일 (토)",
    },
    venue: "세종문화회관 오페라극장",
    time: "오후 7시 30분",
    runningTime: "약 2시간",
  },
} satisfies Meta<typeof SummaryMobile>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
};

export const Secondary: Story = {
  args: {
  }
};
