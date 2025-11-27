import type { Meta, StoryObj } from '@storybook/react-vite';
import MobileFilter from './MobileFilter';

const meta = {
  title: 'Features/Filter/MobileFilter',
  component: MobileFilter,
  tags: ['autodocs'],
  args: { 
  },
} satisfies Meta<typeof MobileFilter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
};

export const Secondary: Story = {
  args: {
  }
};
