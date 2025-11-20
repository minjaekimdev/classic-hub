import type { Meta, StoryObj } from '@storybook/react-vite';
import FeedbackModal from './index';

const meta = {
  title: 'Shared/FeedbackModal',
  component: FeedbackModal,
  tags: ['autodocs'],
  args: { 
  },
} satisfies Meta<typeof FeedbackModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
};

export const Secondary: Story = {
  args: {
  }
};
