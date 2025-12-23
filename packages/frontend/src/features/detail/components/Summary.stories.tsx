import type { Meta, StoryObj } from '@storybook/react-vite';
import Summary from './Summary';

const meta = {
  title: 'Features/Module/Summary',
  component: Summary,
  tags: ['autodocs'],
  args: { 
  },
} satisfies Meta<typeof Summary>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
};

export const Secondary: Story = {
  args: {
  }
};
