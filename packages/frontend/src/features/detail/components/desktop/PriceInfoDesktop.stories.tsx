import type { Meta, StoryObj } from '@storybook/react-vite';
import PriceInfoDesktop from './PriceInfoDesktop';

const meta = {
  title: 'Features/Module/PriceInfoDesktop',
  component: PriceInfoDesktop,
  tags: ['autodocs'],
  args: {
  },
} satisfies Meta<typeof PriceInfoDesktop>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
};

export const Secondary: Story = {
  args: {
  }
};
