import type { Meta, StoryObj } from '@storybook/react-vite';
import BookmarkSearchBox from './BookmarkSearchBox';

const meta = {
  title: 'features/bookmark/BookmarkSearchBox',
  component: BookmarkSearchBox,
  tags: ['autodocs'],
  args: { 
  },
} satisfies Meta<typeof BookmarkSearchBox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
};

export const Secondary: Story = {
  args: {
  }
};
