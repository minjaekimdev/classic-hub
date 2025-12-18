import type { Meta, StoryObj } from '@storybook/react-vite';
import Home from './Home';

const meta = {
  title: 'pages/Home',
  component: Home,
  tags: ['autodocs'],
  args: { 
  },
} satisfies Meta<typeof Home>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
};

export const Secondary: Story = {
  args: {
  }
};
