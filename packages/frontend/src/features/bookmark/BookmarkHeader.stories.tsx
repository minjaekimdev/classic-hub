import type { Meta, StoryObj } from '@storybook/react-vite';
import BookmarkHeader from './BookmarkHeader';

const meta = {
  title: 'features/bookmark/BookmarkHeader',
  component: BookmarkHeader,
  tags: ['autodocs'],
  args: { 
    pfNum: 3
  },
} satisfies Meta<typeof BookmarkHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
};

export const Secondary: Story = {
  args: {
  }
};
