import type { Meta, StoryObj } from '@storybook/react-vite';
import VenueInfo from './VenueInfo';

const meta = {
  title: 'features/detail/shared/VenueInfo',
  component: VenueInfo,
  tags: ['autodocs'],
  args: { 
    venue: "세종문화회관 오페라극장",
  },
} satisfies Meta<typeof VenueInfo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {

};

export const Secondary: Story = {
  args: {
  }
};
