import type { Meta, StoryObj } from '@storybook/react-vite';
import RankingBadge from './RankingBadge';

const meta = {
  title: 'features/ranking/RankingBadge',
  component: RankingBadge,
  tags: ['autodocs'],
  args: { 
    rank: 1,
  },
} satisfies Meta<typeof RankingBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
};

export const Secondary: Story = {
  args: {
    rank: 2,
  }
};
