import type { Meta, StoryObj } from '@storybook/react-vite';
import Result from './Result';

const meta = {
  title: 'pages/Result',
  component: Result,
  tags: ['autodocs'],
  args: { 
  },
} satisfies Meta<typeof Result>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
};

export const Secondary: Story = {
  args: {
  }
};
