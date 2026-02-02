import type { Meta, StoryObj } from '@storybook/react-vite';
import ComponentName from './FilterMobile';
import { fn } from 'storybook/test';

const meta = {
  title: 'Features/Module/ComponentName',
  component: ComponentName,
  tags: ['autodocs'],
  args: { 
    isOpen: true,
    onClose: fn(),
    totalResultCount: 13,
  },
} satisfies Meta<typeof ComponentName>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
};

export const Secondary: Story = {
  args: {
  }
};
