import type { Meta, StoryObj } from "@storybook/react-vite";
import ResultFilterMobile from "./ResultFilterMobile";

const meta = {
  title: "features/filter/result/FilterMobile",
  component: ResultFilterMobile,
  tags: ["autodocs"],
  args: {
    isOpen: true,
    onClose: () => {},
    totalResultCount: 13,
  },
} satisfies Meta<typeof ResultFilterMobile>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {},
};
