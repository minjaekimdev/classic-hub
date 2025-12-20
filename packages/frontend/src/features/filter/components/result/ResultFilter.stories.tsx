import type { Meta, StoryObj } from '@storybook/react-vite';
import ResultFilter from './ResultFilter';

const meta = {
  title: 'features/filter/result/ResultFilter',
  component: ResultFilter,
  tags: ['autodocs'],
  args: { 
  },
} satisfies Meta<typeof ResultFilter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
};

export const Secondary: Story = {
  args: {
  }
};
