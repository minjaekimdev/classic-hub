import type { Meta, StoryObj } from '@storybook/react-vite';
import HeaderMobile from './HeaderMobile';

const meta = {
  title: 'features/detail/mobile/HeaderMobile',
  component: HeaderMobile,
  tags: ['autodocs'],
  args: { 
    title: "조성진 피아노 리사이틀",
  },
} satisfies Meta<typeof HeaderMobile>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
};

export const Secondary: Story = {
  args: {
  }
};
