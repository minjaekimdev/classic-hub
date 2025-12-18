import type { Meta, StoryObj } from '@storybook/react-vite';
import BookmarkFilter from './BookmarkFilter';

const meta = {
  title: 'features/bookmark/BookmarkFilter',
  component: BookmarkFilter,
  tags: ['autodocs'],
  args: { 
  },
} satisfies Meta<typeof BookmarkFilter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
};

export const Secondary: Story = {
  args: {
  }
};
