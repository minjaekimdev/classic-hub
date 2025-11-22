import type { Meta, StoryObj } from '@storybook/react-vite';
import FilterSearchField from './index';

const meta = {
  title: 'Features/Filter/FilterSearchField',
  component: FilterSearchField,
  tags: ['autodocs'],
  args: { 
  },
} satisfies Meta<typeof FilterSearchField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
};

export const Secondary: Story = {
  args: {
  }
};
