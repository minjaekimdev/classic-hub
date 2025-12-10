import type { Meta, StoryObj } from '@storybook/react-vite';
import RankingList from './RankingList';

const meta = {
  title: 'Features/Module/RankingList',
  component: RankingList,
  tags: ['autodocs'],
  args: { 
  },
} satisfies Meta<typeof RankingList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
};

export const Secondary: Story = {
  args: {
  }
};
