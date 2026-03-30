import type { Meta, StoryObj } from '@storybook/react-vite';
import BottomNavBar from './BottomNavBar';

const meta = {
  title: 'shared/navigation/BottomNavBar',
  component: BottomNavBar,
  tags: ['autodocs'],
  args: { 
  },
} satisfies Meta<typeof BottomNavBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
};

export const Secondary: Story = {
  args: {
  }
};
