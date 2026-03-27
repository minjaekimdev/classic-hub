import type { Meta, StoryObj } from '@storybook/react-vite';
import ComposerBadge from './ComposerBadge';

const meta = {
  title: 'shared/ui/ComposerBadge',
  component: ComposerBadge,
  tags: ['autodocs'],
  args: { 
    composer: "프란츠 리스트"
  },
} satisfies Meta<typeof ComposerBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
};

export const Secondary: Story = {
  args: {
  }
};
