import type { Meta, StoryObj } from "@storybook/react-vite";
import Modal from "./Modal";

const meta = {
  title: "Features/Module/Modal",
  component: Modal,
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {},
};
