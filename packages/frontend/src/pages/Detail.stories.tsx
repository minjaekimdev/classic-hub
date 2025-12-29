import type { Meta, StoryObj } from '@storybook/react-vite';
import Detail from './Detail';

const meta = {
  title: 'pages/Detail',
  component: Detail,
  tags: ['autodocs'],
  args: { 
  },
} satisfies Meta<typeof Detail>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
};

export const Secondary: Story = {
  args: {
  }
};
