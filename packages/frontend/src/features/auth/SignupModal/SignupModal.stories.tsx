import "@app/styles/main.scss";
import type { Meta, StoryObj } from "@storybook/react-vite";
import SignupModal from "./index";

const meta = {
  title: "Features/Auth/SignupModal",
  component: SignupModal,
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof SignupModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {},
};
