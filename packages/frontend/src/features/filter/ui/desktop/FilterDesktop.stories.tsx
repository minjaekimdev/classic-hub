import type { Meta, StoryObj } from "@storybook/react-vite";
import FilterDesktop from "./FilterDesktop";

const meta = {
  title: "features/filter/FilterDesktop",
  component: FilterDesktop,
  tags: ["autodocs"],
  args: {
    isOpen: true,
  },
} satisfies Meta<typeof FilterDesktop>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {},
};
