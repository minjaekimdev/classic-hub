import type { Meta, StoryObj } from '@storybook/react-vite';
import FilterMobile from './FilterMobile';

const meta = {
  title: 'Features/Filter/FilterMobile',
  component: FilterMobile,
  tags: ['autodocs'],
  args: { 
  },
} satisfies Meta<typeof FilterMobile>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
};

export const Secondary: Story = {
  args: {
  }
};
