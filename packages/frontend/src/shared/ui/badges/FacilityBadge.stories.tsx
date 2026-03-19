import type { Meta, StoryObj } from "@storybook/react-vite";
import FaciltiyBadge from "./FaciltiyBadge";

const meta = {
  title: "shared/ui/FaciltiyBadge",
  component: FaciltiyBadge,
  tags: ["autodocs"],
  args: {
    children: "asdf",
  },
} satisfies Meta<typeof FaciltiyBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {},
};
