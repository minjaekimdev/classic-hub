import type { Meta, StoryObj } from '@storybook/react-vite';
import FilterField from './index';

const meta = {
  title: 'Features/Filter/FilterField',
  component: FilterField,
  tags: ['autodocs'],
  args: { 
    label: "가격",
  },
} satisfies Meta<typeof FilterField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
};

export const Secondary: Story = {
  args: {
  }
};
