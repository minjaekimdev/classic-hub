import type { Meta, StoryObj } from '@storybook/react-vite';
import MainDetailMobile from './MainDetailMobile';

const meta = {
  title: 'features/detail/mobile/MainDetailMobile',
  component: MainDetailMobile,
  tags: ['autodocs'],
  args: { 
  },
} satisfies Meta<typeof MainDetailMobile>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
};

export const Secondary: Story = {
  args: {
  }
};
