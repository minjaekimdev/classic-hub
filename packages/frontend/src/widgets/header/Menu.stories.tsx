import type { Meta, StoryObj } from '@storybook/react-vite';
import ComponentName from './index';

const meta = {
  title: 'Widgets/Header/Menu',
  component: ComponentName,
  tags: ['autodocs'],
  args: { 
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
