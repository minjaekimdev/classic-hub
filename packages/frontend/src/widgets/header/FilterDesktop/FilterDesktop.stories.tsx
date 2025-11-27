import type { Meta, StoryObj } from '@storybook/react-vite';
import FilterDesktop from './index';

const meta = {
  title: 'Features/Filter/FilterDesktop',
  component: FilterDesktop,
  tags: ['autodocs'],
  args: { 
  },
} satisfies Meta<typeof FilterDesktop>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
};

export const Secondary: Story = {
  args: {
  }
};
