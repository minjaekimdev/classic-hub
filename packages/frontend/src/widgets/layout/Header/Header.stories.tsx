import "@app/styles/main.scss";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Header from "./index";

const meta = {
  title: "Widgets/layout/Header",
  component: Header,
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof Header>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {},
};
