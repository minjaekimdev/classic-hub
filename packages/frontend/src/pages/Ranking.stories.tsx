import type { Meta, StoryObj } from '@storybook/react-vite';
import Ranking from './ranking';

const meta = {
  title: 'Features/pages/Ranking',
  component: Ranking,
  tags: ['autodocs'],
  args: { 
  },
} satisfies Meta<typeof Ranking>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
};

export const Secondary: Story = {
  args: {
  }
};
