import type { Meta, StoryObj } from '@storybook/react-vite';
import Dropdown from './Dropdown';

const meta = {
  title: 'Features/Filter/FilterDesktop/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  args: { 
  },
} satisfies Meta<typeof Dropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
};

export const Secondary: Story = {
  args: {
  }
};
