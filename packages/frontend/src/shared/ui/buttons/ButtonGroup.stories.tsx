import type { Meta, StoryObj } from "@storybook/react-vite";
import ButtonGroup from "./CancelConfirmButtons";

const meta = {
  title: "shared/ui/ButtonGroup",
  component: ButtonGroup,
  tags: ["autodocs"],
  args: {
    mainText: "삭제",
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {},
};
