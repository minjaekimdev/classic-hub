import type { Meta, StoryObj } from '@storybook/react-vite';
import Bookmark from './Bookmark';

const meta = {
  title: 'pages/Bookmark',
  component: Bookmark,
  tags: ['autodocs'],
  args: { 
  },
} satisfies Meta<typeof Bookmark>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
};

export const Secondary: Story = {
  args: {
  }
};
