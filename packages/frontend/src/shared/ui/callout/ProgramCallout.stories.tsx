import type { Meta, StoryObj } from '@storybook/react-vite';
import ProgramCallout from './ProgramCallout';

const meta = {
  title: 'shared/ui/ProgramCallout',
  component: ProgramCallout,
  tags: ['autodocs'],
  args: { 
    composer: "베토벤",
    piece: '교향곡 9번 "합창"',
    other: 3,
  },
} satisfies Meta<typeof ProgramCallout>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
};

export const Secondary: Story = {
  args: {
  }
};
