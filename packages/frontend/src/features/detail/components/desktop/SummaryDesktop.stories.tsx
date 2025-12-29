import type { Meta, StoryObj } from '@storybook/react-vite';
import SummaryDesktop from './SummaryDesktop';

const meta = {
  title: 'features/detail/Summary',
  component: SummaryDesktop,
  tags: ['autodocs'],
  args: { 
  },
} satisfies Meta<typeof SummaryDesktop>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
};

export const Secondary: Story = {
  args: {
  }
};
