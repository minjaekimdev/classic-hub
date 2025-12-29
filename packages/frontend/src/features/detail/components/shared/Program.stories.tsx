import type { Meta, StoryObj } from "@storybook/react-vite";
import Program from "./ProgramInfo";

const meta = {
  title: "features/detail/shared/Program",
  component: Program,
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof Program>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {},
};
