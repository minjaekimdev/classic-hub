import type { Meta, StoryObj } from '@storybook/react-vite';
import AlbumItem from './AlbumItem';

const meta = {
  title: 'features/components/AlbumItem',
  component: AlbumItem,
  tags: ['autodocs'],
  args: { 
  },
} satisfies Meta<typeof AlbumItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
};

export const Secondary: Story = {
  args: {
  }
};
