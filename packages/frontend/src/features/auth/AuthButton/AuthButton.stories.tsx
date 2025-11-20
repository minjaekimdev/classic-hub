import type { Meta, StoryObj } from '@storybook/react-vite';
import AuthButton from './index';

const meta = {
  title: 'Features/Auth/AuthButton',
  component: AuthButton,
  tags: ['autodocs'],
  args: { 
    children: "로그인"
  },
} satisfies Meta<typeof AuthButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
};

export const Secondary: Story = {
  args: {
  }
};
