import type { Meta, StoryObj } from '@storybook/react-vite';
import PerformanceCardHomePrice from './index';

const meta = {
  title: 'Features/Performance/PerformanceCardHomePrice',
  component: PerformanceCardHomePrice,
  tags: ['autodocs'],
  args: { 
    price: "100,000"
  },
} satisfies Meta<typeof PerformanceCardHomePrice>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
};

export const Secondary: Story = {
  args: {
  }
};
