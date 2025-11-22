import type { Meta, StoryObj } from '@storybook/react-vite';
import FilterDateField from './index';

const meta = {
  title: 'Features/Filter/FilterDateField',
  component: FilterDateField,
  tags: ['autodocs'],
  args: { 
  },
} satisfies Meta<typeof FilterDateField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
};

export const Secondary: Story = {
  args: {
  }
};
