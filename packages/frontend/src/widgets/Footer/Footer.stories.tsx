import type { Meta, StoryObj } from '@storybook/react-vite';
import Footer from './index';

const meta = {
  title: 'Widgets/Footer',
  component: Footer,
  tags: ['autodocs'],
  args: { 
  },
} satisfies Meta<typeof Footer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
};

export const Secondary: Story = {
  args: {
  }
};
