import type { Meta, StoryObj } from '@storybook/react-vite';
import HomePerformanceRanking from './index';

const meta = {
  title: 'Features/Widgets/HomePerformanceRanking',
  component: HomePerformanceRanking,
  tags: ['autodocs'],
  args: { 
  },
} satisfies Meta<typeof HomePerformanceRanking>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
};

export const Secondary: Story = {
  args: {
  }
};
