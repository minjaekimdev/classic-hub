import type { Meta, StoryObj } from '@storybook/react-vite';
import FilterTest from './FilterTest';

const meta = {
  title: 'features/filter/result/FilterTest',
  component: FilterTest,
  tags: ['autodocs'],
  args: { 
    isOpen: true,
    onClose: () => {},
    totalResultCount: 13,
  },
} satisfies Meta<typeof FilterTest>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
};

export const Secondary: Story = {
  args: {
  }
};
