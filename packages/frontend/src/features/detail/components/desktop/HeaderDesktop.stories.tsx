import type { Meta, StoryObj } from '@storybook/react-vite';
import HeaderDesktop from './HeaderDesktop';

const meta = {
  title: 'features/detail/desktop/HeaderDesktop',
  component: HeaderDesktop,
  tags: ['autodocs'],
  args: { 
    title: "조성진 피아노 리사이틀",
  },
} satisfies Meta<typeof HeaderDesktop>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
};

export const Secondary: Story = {
  args: {
  }
};
