import type { Meta, StoryObj } from '@storybook/react-vite';
import LoginModal from './index';

const meta = {
  title: 'Features/Module/LoginModal',
  component: LoginModal,
  tags: ['autodocs'],
  args: { 
  },
} satisfies Meta<typeof LoginModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
};

export const Secondary: Story = {
  args: {
  }
};
