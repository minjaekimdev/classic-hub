import type { Meta, StoryObj } from '@storybook/react-vite';
import RankingHeader from './RankingHeader';

const meta = {
  title: 'Features/Ranking/RankingHeader',
  component: RankingHeader,
  tags: ['autodocs'],
  args: { 
  },
} satisfies Meta<typeof RankingHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
};

export const Secondary: Story = {
  args: {
  }
};
