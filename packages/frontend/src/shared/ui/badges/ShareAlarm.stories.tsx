import type { Meta, StoryObj } from '@storybook/react-vite';
import ShareAlarm from './ShareAlarm';

const meta = {
  title: 'shared/ui/ShareAlarm',
  component: ShareAlarm,
  tags: ['autodocs'],
  args: { 
  },
} satisfies Meta<typeof ShareAlarm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
};

export const Secondary: Story = {
  args: {
  }
};
