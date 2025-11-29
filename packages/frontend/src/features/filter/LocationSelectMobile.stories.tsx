import type { Meta, StoryObj } from '@storybook/react-vite';
import LocationSelectMobile from './LocationSelectMobile';

const meta = {
  title: 'Features/Filter/LocationSelectMobile',
  component: LocationSelectMobile,
  tags: ['autodocs'],
  args: { 
  },
} satisfies Meta<typeof LocationSelectMobile>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
};

export const Secondary: Story = {
  args: {
  }
};
