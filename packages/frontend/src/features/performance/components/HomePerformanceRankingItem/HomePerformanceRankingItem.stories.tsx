import type { Meta, StoryObj } from '@storybook/react-vite';
import HomePerformanceRankingItem from './index';

const meta = {
  title: 'Features/Performance/HomePerformanceRankingItem',
  component: HomePerformanceRankingItem,
  tags: ['autodocs'],
  args: { 
  },
} satisfies Meta<typeof HomePerformanceRankingItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
};

export const Secondary: Story = {
  args: {
  }
};
